/** Pure helpers for trimming decoded audio and writing a 16-bit PCM WAV file. */

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

/** Formats seconds as m:ss.s for labels. */
export function formatAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const tenth = Math.floor((seconds - whole) * 10);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}.${tenth}`;
}

/** Decodes an audio File into an AudioBuffer using the Web Audio API. */
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

/** Copies an AudioBuffer into plain Float32Array channel data. */
export function audioBufferToPcm(buffer: AudioBuffer): PcmData {
  const channels: Float32Array[] = [];
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    channels.push(new Float32Array(buffer.getChannelData(channel)));
  }
  return { sampleRate: buffer.sampleRate, channels };
}

/** Slices a decoded buffer to the requested start/end seconds. */
export function trimAudioBuffer(
  buffer: AudioBuffer,
  start: number,
  end: number,
): PcmData {
  const duration = buffer.duration;
  const from = Math.max(0, Math.min(start, duration));
  const to = Math.max(from, Math.min(end, duration));
  const startSample = Math.floor(from * buffer.sampleRate);
  const endSample = Math.min(
    buffer.length,
    Math.ceil(to * buffer.sampleRate),
  );
  const length = Math.max(0, endSample - startSample);

  const channels: Float32Array[] = [];
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const source = buffer.getChannelData(channel);
    channels.push(source.slice(startSample, startSample + length));
  }
  return { sampleRate: buffer.sampleRate, channels };
}

/** Encodes interleaved 16-bit PCM samples into a WAV Blob. */
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
      const value =
        clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
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
