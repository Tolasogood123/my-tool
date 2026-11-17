/** Pure helpers for applying gain to decoded audio and exporting a WAV file. */

import { formatBytes } from "@/lib/utils/format";

export const MAX_AUDIO_UPLOAD_BYTES = 20 * 1024 * 1024;

const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/ogg",
];

export interface PcmData {
  sampleRate: number;
  channels: Float32Array[];
}

export interface GainAnalysis {
  peak: number;
  peakDb: number;
  clippedSamples: number;
  totalSamples: number;
}

export function validateAudioFile(file: File): string | null {
  const looksAccepted =
    ACCEPTED_AUDIO_TYPES.includes(file.type) ||
    /\.(mp3|wav|ogg)$/i.test(file.name);
  if (!looksAccepted) {
    return "Unsupported file type. Choose an MP3, WAV, or OGG audio file.";
  }
  if (file.size === 0) return "That file is empty. Choose another audio file.";
  if (file.size > MAX_AUDIO_UPLOAD_BYTES) {
    return `That audio file is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_AUDIO_UPLOAD_BYTES)}.`;
  }
  return null;
}

export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const tenth = Math.floor((seconds - whole) * 10);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}.${tenth}`;
}

export function decodeAudioFile(
  context: AudioContext,
  file: File,
): Promise<AudioBuffer> {
  return file.arrayBuffer().then(
    (data) =>
      new Promise<AudioBuffer>((resolve, reject) => {
        const result = context.decodeAudioData(
          data,
          (buffer) => resolve(buffer),
          (error) => reject(error),
        );
        if (result && typeof (result as Promise<AudioBuffer>).then === "function") {
          (result as Promise<AudioBuffer>).then(resolve, reject);
        }
      }),
  );
}

export function audioBufferToPcm(buffer: AudioBuffer): PcmData {
  const channels: Float32Array[] = [];
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    channels.push(new Float32Array(buffer.getChannelData(channel)));
  }
  return { sampleRate: buffer.sampleRate, channels };
}

/** Multiplies every sample by a linear gain. Values above 1 may clip on export. */
export function applyGain(pcm: PcmData, gain: number): PcmData {
  if (!Number.isFinite(gain) || gain < 0) {
    throw new Error("Gain must be zero or greater.");
  }
  return {
    sampleRate: pcm.sampleRate,
    channels: pcm.channels.map((data) => {
      const output = new Float32Array(data.length);
      for (let i = 0; i < data.length; i++) output[i] = data[i] * gain;
      return output;
    }),
  };
}

/** Reports the original peak and how many samples would clip at this gain. */
export function analyzeGain(pcm: PcmData, gain: number): GainAnalysis {
  let peak = 0;
  let clippedSamples = 0;
  let totalSamples = 0;
  const factor = Number.isFinite(gain) && gain >= 0 ? gain : 1;

  for (const data of pcm.channels) {
    for (let i = 0; i < data.length; i++) {
      const value = Math.abs(data[i]);
      if (value > peak) peak = value;
      if (Math.abs(data[i] * factor) > 1) clippedSamples++;
      totalSamples++;
    }
  }
  const peakDb = peak > 0 ? 20 * Math.log10(peak) : -Infinity;
  return { peak, peakDb, clippedSamples, totalSamples };
}

export function encodeWav(pcm: PcmData): Blob {
  const numChannels = pcm.channels.length;
  if (numChannels === 0) throw new Error("There is no audio to encode.");
  const sampleRate = pcm.sampleRate;
  const numSamples = pcm.channels[0].length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      const clamped = Math.max(-1, Math.min(1, pcm.channels[channel][i]));
      const value = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, value, true);
      offset += 2;
    }
  }
  return new Blob([buffer], { type: "audio/wav" });
}

export function pcmDuration(pcm: PcmData): number {
  return pcm.channels.length > 0
    ? pcm.channels[0].length / pcm.sampleRate
    : 0;
}

export function safeAudioBaseName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "") || "audio"
  );
}
