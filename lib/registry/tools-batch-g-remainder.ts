import type { Tool } from "@/types/tool";

/** Batch G, tools 2-5: browser-based audio editing and subtitle conversion. */
export const batchGRemainderTools: Tool[] = [
  {
    slug: "audio-trimmer",
    title: "Audio Trimmer",
    description:
      "Cut an audio file to a chosen start and end time in your browser, then export the trimmed clip as a WAV without uploading or installing anything.",
    category: "video-audio",
    keywords: ["audio trimmer", "trim audio online", "cut mp3 file", "audio cutter", "trim wav"],
    icon: "Clapperboard",
    status: "ready",
    popularity: 81,
    addedAt: "2026-11-22",
    related: ["audio-volume-booster", "audio-speed-changer", "video-thumbnail-extractor"],
    content: {
      what: "The Audio Trimmer decodes an MP3, WAV, or OGG file with the Web Audio API, lets you pick a start and end point down to a tenth of a second, and writes the selected portion as a 16-bit PCM WAV file. Both number fields and sliders let you set the range, and a preview player confirms the result. Decoding and encoding happen locally, so the recording never leaves your device.",
      howTo: [
        "Choose an MP3, WAV, or OGG file up to 20 MB.",
        "Wait for the browser to decode the audio and show its duration.",
        "Set the start and end times with the number fields or the sliders.",
        "Click Trim audio, preview the clip, then download the WAV.",
      ],
      example:
        "A podcaster loads a 34-minute interview, trims from 00:12:30.0 to 00:14:05.5 to remove a long pause, and downloads a 95-second WAV clip.",
      benefits: [
        "Cut audio precisely without installing editing software.",
        "Two input methods: exact numbers or quick sliders.",
        "Standard WAV output that works in any editor or player.",
        "Fully private: audio is decoded and exported on your device.",
      ],
      faqs: [
        {
          q: "Why does the export become a WAV even if I started with MP3?",
          a: "Browsers decode compressed files into raw samples, and the simplest lossless format to write back out is PCM WAV. The audio content is preserved; only the container and encoding change. Use an Audio Volume Booster or another converter afterward if you need a compressed file.",
        },
        {
          q: "What is the maximum file size?",
          a: "Audio files up to 20 MB are accepted. Very long recordings may exceed that limit, so trim them in a dedicated editor first or use a shorter source clip.",
        },
        {
          q: "Can I set times beyond the audio length?",
          a: "No. The tool clamps the range to the decoded duration and rejects a range whose end is not after its start. The preview player shows the valid span so you can adjust easily.",
        },
        {
          q: "Is the cut sample-accurate?",
          a: "The start and end are converted to sample positions at the file's sample rate. Times are entered to tenths of a second, so the boundary is as precise as the input allows.",
        },
      ],
    },
  },
  {
    slug: "audio-volume-booster",
    title: "Audio Volume Booster",
    description:
      "Raise or lower the level of a recording with a gain slider, see a clipping warning before export, and download the adjusted audio as a WAV file.",
    category: "video-audio",
    keywords: ["audio volume booster", "increase audio volume", "amplify audio", "gain booster", "loudness adjuster"],
    icon: "Clapperboard",
    status: "ready",
    popularity: 80,
    addedAt: "2026-11-22",
    related: ["audio-trimmer", "audio-speed-changer", "video-thumbnail-extractor"],
    content: {
      what: "The Audio Volume Booster decodes your file into raw samples and multiplies every sample by a linear gain you choose. Before you export, it reports the recording's original peak level and counts how many samples would exceed full scale at that gain, so you can back off before distortion is introduced. The result is written as a 16-bit PCM WAV and can be previewed and downloaded locally.",
      howTo: [
        "Load an MP3, WAV, or OGG file up to 20 MB.",
        "Move the gain slider or type a multiplier between 0.1x and 4x.",
        "Check the peak readout and the clipping warning.",
        "Click Boost volume, listen to the preview, and download the WAV.",
      ],
      example:
        "A voice memo peaks at -12 dBFS. Setting a 3x gain raises it by about 9.5 dB; the tool reports zero clipped samples, so the user exports a louder, clean WAV.",
      benefits: [
        "Simple gain control with an easy-to-read multiplier.",
        "Peak level and clipping count shown before you export.",
        "Works entirely in the browser with no upload.",
        "Also lowers volume when a recording is too hot.",
      ],
      faqs: [
        {
          q: "What does a clipping warning mean?",
          a: "It means some samples would rise above 0 dBFS after the gain is applied. Since WAV cannot store values above full scale, those samples are flattened, which sounds like distortion. Lower the gain until the warning disappears.",
        },
        {
          q: "Why not normalize to a fixed loudness instead?",
          a: "Normalization targets a chosen peak automatically, but a manual gain gives you creative control and lets you compare levels by ear. The peak readout here helps you make that choice.",
        },
        {
          q: "Does boosting make a quiet file sound clearer?",
          a: "No. Amplification raises both the signal and its noise floor. If a recording is noisy, boosting will make the noise louder too; cleaning the source first gives better results.",
        },
        {
          q: "Will the exported file be bigger?",
          a: "Amplification does not change duration, sample rate, or channel count, so the WAV size stays about the same as the decoded source.",
        },
      ],
    },
  },
  {
    slug: "audio-speed-changer",
    title: "Audio Speed Changer",
    description:
      "Speed up or slow down a recording by resampling its audio buffer, preview the new tempo and length, and export the result as a WAV file.",
    category: "video-audio",
    keywords: ["audio speed changer", "change audio tempo", "speed up audio", "slow down audio", "tempo changer"],
    icon: "Clapperboard",
    status: "ready",
    popularity: 79,
    addedAt: "2026-11-22",
    related: ["audio-trimmer", "audio-volume-booster", "video-thumbnail-extractor"],
    content: {
      what: "The Audio Speed Changer resamples decoded audio to a new number of samples while keeping the sample rate fixed, which changes playback duration. Linear interpolation fills the gaps, so the result is smooth for modest changes. The tool is honest about the trade-off: because samples shift, pitch moves with tempo, exactly like changing the speed of a tape. No pitch correction or time-stretching is performed.",
      howTo: [
        "Choose an MP3, WAV, or OGG file up to 20 MB.",
        "Pick a speed between 0.25x and 2x with the slider, a number, or a preset.",
        "Note the estimated output length and the pitch note.",
        "Click Change speed, preview the result, then download the WAV.",
      ],
      example:
        "A student records a 20-minute lecture and plays it back at 1.5x, producing a 13-minute 20-second WAV so they can review it faster, accepting the higher pitch.",
      benefits: [
        "Quick presets for common speeds plus fine-grained control.",
        "Shows the estimated new duration before you export.",
        "Clear explanation of how pitch changes with speed.",
        "Private, browser-only processing with a WAV download.",
      ],
      faqs: [
        {
          q: "Will the voice keep its original pitch?",
          a: "No. Resampling changes tempo and pitch together. At 2x the audio is an octave higher; at 0.5x it is an octave lower. True time-stretching that preserves pitch needs a different algorithm and is not offered here.",
        },
        {
          q: "What causes the artifacts at extreme speeds?",
          a: "Aggressive resampling either drops many samples or repeats them, and simple linear interpolation cannot reconstruct all the original detail. For voice, staying between about 0.75x and 1.5x keeps artifacts minimal.",
        },
        {
          q: "Can I slow audio down to transcribe it more easily?",
          a: "Yes. Lower speeds such as 0.75x or 0.5x make speech easier to follow, though voices will sound deeper. Pair it with the Audio Trimmer to isolate a difficult passage first.",
        },
        {
          q: "Why is the output a WAV rather than MP3?",
          a: "The Web Audio API gives the tool raw decoded samples, and writing PCM WAV locally requires no encoder or extra dependency. The file plays in any modern player and can be converted later.",
        },
      ],
    },
  },
  {
    slug: "subtitle-converter",
    title: "Subtitle Converter",
    description:
      "Convert SRT subtitles to WebVTT and back with timestamp validation, cue counting and full UTF-8 support, including Khmer caption text.",
    category: "video-audio",
    keywords: ["subtitle converter", "srt to vtt", "vtt to srt", "subtitle translator format", "caption converter"],
    icon: "Clapperboard",
    status: "ready",
    popularity: 78,
    addedAt: "2026-11-22",
    related: ["video-thumbnail-extractor", "text-diff-checker", "word-counter"],
    content: {
      what: "The Subtitle Converter reads SubRip (.srt) and WebVTT (.vtt) files, checks every cue's start and end timestamp, and rewrites the timings for the other format. It keeps each caption line exactly as written, so UTF-8 text such as Khmer, Arabic, or emoji survives the round trip. A validation step reports invalid timestamps, reversed ranges, overlapping cues, and empty captions before conversion, and the result can be copied or downloaded.",
      howTo: [
        "Load an .srt or .vtt file, or paste subtitle text into the box.",
        "Choose SRT to WebVTT or WebVTT to SRT.",
        "Click Validate timestamps to review errors and warnings.",
        "Click Convert subtitles, then copy or download the result.",
      ],
      example:
        "A video editor receives an SRT file with Khmer captions and commas in the timings. Converting to WebVTT produces a WEBVTT header with dot-based timestamps while keeping lines like «សួស្តី!» unchanged.",
      benefits: [
        "Handles both directions with automatic format detection.",
        "Validates timing order before writing a single line.",
        "Preserves non-Latin scripts and emoji as UTF-8 text.",
        "Works offline in the browser with a copy and download option.",
      ],
      faqs: [
        {
          q: "Does conversion change the caption language or text?",
          a: "No. Only timestamps, cue numbering, and the header line change. Caption text is passed through untouched, so Khmer and other scripts stay intact.",
        },
        {
          q: "What timestamp formats are accepted?",
          a: "SRT uses HH:MM:SS,mmm and WebVTT accepts HH:MM:SS.mmm or MM:SS.mmm. Both are parsed into milliseconds and reformatted for the target, with hours padded to two digits.",
        },
        {
          q: "What happens when a cue ends before it starts?",
          a: "The validator flags it as an error and conversion stops with a message naming the cue. Fix the timing in the input box and convert again.",
        },
        {
          q: "Are WebVTT styling and position settings kept?",
          a: "Timing settings that follow the end timestamp are preserved when converting to WebVTT. Standalone STYLE and NOTE blocks are not carried over, so complex styling should be re-applied in your player.",
        },
      ],
    },
  },
];
