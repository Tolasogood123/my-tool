import type { BlogPost } from "@/lib/blog";

/** Original guides added in Batch G. */
export const batchGBlogs: BlogPost[] = [
  {
    slug: "browser-audio-and-subtitle-editing-guide",
    title: "A Practical Guide to Editing Audio and Subtitles in Your Browser",
    description:
      "Trim recordings, fix levels, change tempo honestly, and convert SRT to WebVTT with full Unicode support, all without installing software.",
    date: "2026-11-22",
    readingMinutes: 6,
    tags: ["Audio", "Video", "Subtitles", "Browser Tools"],
    content: `Audio and captions are the two parts of a video project that people most often rush. A recording is a little too long, a voice is too quiet, a lecture needs to be reviewed faster, and a subtitle file arrives in the wrong format. Each problem used to mean opening a heavy editor or hunting for an upload site. Modern browsers can now handle all four jobs locally, which is faster and far more private. This guide walks through a practical workflow using the [Audio Trimmer](/tools/audio-trimmer), the [Audio Volume Booster](/tools/audio-volume-booster), the [Audio Speed Changer](/tools/audio-speed-changer), and the [Subtitle Converter](/tools/subtitle-converter).

## Why do this in the browser at all

Uploading a file to a random website has two costs. First, you wait for the upload and the download, which is painful on a phone connection. Second, you hand a copy of your recording to someone else's server. For interviews, lectures, or anything with personal voices, that second cost matters. Browser tools use the Web Audio API to decode a file into raw samples, process those samples in JavaScript, and write a new file straight to your device. Nothing is stored, and there is no account to create.

The trade-off is that your browser, not a studio plugin, does the work. That is fine for everyday edits: cutting a clip, adjusting loudness, nudging tempo, and rewriting caption timings. It is not a replacement for a digital audio workstation when you need noise reduction, equalization, or multitrack mixing.

## Start with the cut

Trimming is usually the first step because everything afterward operates on a smaller file. Load a recording into the [Audio Trimmer](/tools/audio-trimmer), set a start and an end point, and export the selection. The tool accepts the common formats people actually have: MP3, WAV, and OGG, up to 20 MB.

Two input styles are available. Number fields let you type an exact time such as 74.5 seconds, which is useful when you are following a transcript. Sliders let you scrub roughly and refine by eye, which is faster when you simply want to remove a long pause at the beginning. The exported file is a 16-bit PCM WAV. That means the audio is no longer compressed, so the file is larger than the source, but it is also universally readable by editors, players, and transcription tools.

A practical tip: cut a slightly longer section than you think you need. It is easy to tighten a clip later, but you cannot recover a sentence you removed.

## Fix the level before you share

Quiet audio is the most common complaint about recordings made on a phone or in a large room. The [Audio Volume Booster](/tools/audio-volume-booster) multiplies every sample by a gain you choose. A gain of 2 means double amplitude, which is roughly plus six decibels. The tool shows the original peak in dBFS and counts how many samples would go above full scale at your chosen gain.

That clipping counter is the part worth paying attention to. Amplifying a signal past zero dBFS does not make it louder in a clean way; it flattens the peaks and creates distortion. If the warning appears, lower the gain until it disappears. For spoken word, a peak somewhere between minus six and minus one dBFS is a sensible target. If the source was recorded with a lot of background hiss, remember that boosting raises the noise along with the voice. Cleaning the recording at the source always beats amplifying it afterward.

The same control works in reverse. If a file is too hot and clips, a gain below one brings it back down and gives you headroom.

## Change tempo with your eyes open

Playing a lecture at one and a half speed can save a surprising amount of time. The [Audio Speed Changer](/tools/audio-speed-changer) resamples the audio: it keeps the sample rate the same but changes how many samples are played per second. A 20 minute file at 1.5x becomes about 13 minutes and 20 seconds.

Here is the honest part, and it is important. Resampling changes pitch along with tempo. At 2x everything is an octave higher, and at 0.5x an octave lower. Voices can sound like chipmunks or like a much deeper speaker. That is the same thing that happened when people changed the speed of a cassette tape, and it is a real physical consequence of the method, not a bug. True time stretching that preserves pitch needs a more complex algorithm.

Because the tool does not pretend otherwise, you can decide whether the trade is acceptable. For quickly scanning a slide recording, a higher pitch is a fair price for time saved. For a song or a voice-over you intend to keep, stay close to 1x, roughly between 0.75x and 1.25x, where interpolation artifacts are minimal. Combined with the trimmer, this makes a good review workflow: isolate the section you care about, then speed it up.

## Captions that survive the format switch

A subtitle file is simple text, but the two dominant formats disagree on small details. SubRip uses an index, a time range written with commas, and the caption text. WebVTT starts with a WEBVTT header and uses dots in its timestamps, and it can carry cue settings and styling. Players and platforms often require one specific format, so converting between them is a routine task.

The [Subtitle Converter](/tools/subtitle-converter) reads both formats, detects which one you supplied, validates every cue, and rewrites the timings for the other. Validation matters more than it sounds. A cue that ends before it starts, a negative time, or a caption that begins before the previous one finished can all cause a player to behave strangely. The tool reports these problems by cue number before writing anything, so you can fix them in the input box.

Unicode is another reason to use a browser converter rather than a careless script. Caption text is passed through unchanged, so Khmer, Arabic, Devanagari, emoji, and mixed-language lines survive the round trip. If you work with Khmer subtitles, check that your editor saved the original as UTF-8; a file saved in a legacy encoding will already be damaged before conversion begins.

## A repeatable workflow

Putting the pieces together:

1. Trim the raw recording down to the section you will actually use.
2. Check the peak and adjust gain until no clipping is reported.
3. If you need a faster review copy, change the speed and accept the pitch shift, or keep the original for anything you will publish.
4. Convert the subtitle file to the format your player expects and clear any timing errors.
5. Preview everything once before publishing.

Every step produces a WAV or a plain text subtitle file, both of which are easy to inspect and re-edit. Keep your original files as well; these tools replace a working copy, never the master.

## Know the limits

Browser audio editing has boundaries. The 20 MB upload ceiling means multi-hour recordings need to be split first. Decoding depends on the codec support built into your browser, so a rare format may fail to open even if the extension looks right. WAV export is lossless but large; convert to a compressed format later if bandwidth matters. And resampling is not pitch-preserving time stretching, as described above.

Within those limits, the four tools cover a surprising amount of everyday work. They are private, fast, and free to use, and they teach you what is actually happening to the media instead of hiding it behind a single button. That understanding is the real advantage: you know when a clip is clean, when a level is safe, and why a sped-up voice sounds the way it does.`,
  },
];
