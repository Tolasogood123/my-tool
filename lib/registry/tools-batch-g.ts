import type { Tool } from "@/types/tool";

/** Batch G, Tool 1: the first tool added by TOLADEV_50_MORE_TOOLS_PROMPT.md. */
export const batchGTools: Tool[] = [
  {
    slug: "video-thumbnail-extractor",
    title: "Video Thumbnail Extractor",
    description:
      "Pick any frame from a video and download it as a PNG or JPEG thumbnail. Seek with a timeline, preview the result and export locally without uploading the video.",
    category: "video-audio",
    keywords: ["video thumbnail extractor", "extract frame from video", "video screenshot", "capture video frame", "thumbnail generator"],
    icon: "Clapperboard",
    status: "ready",
    popularity: 82,
    addedAt: "2026-11-22",
    related: ["image-format-converter", "image-compressor", "jpg-to-pdf"],
    content: {
      what: "The Video Thumbnail Extractor opens a video in your browser, lets you scrub to a specific moment with a timeline, and draws that frame to a canvas. You can save the frame as a lossless PNG or a smaller JPEG with adjustable quality. The video file is never uploaded, and the original resolution of the frame is preserved.",
      howTo: [
        "Choose an MP4, WebM, OGG, or MOV video up to 50 MB.",
        "Use the player and timeline to find the moment you want.",
        "Choose PNG or JPEG, then click Extract frame.",
        "Preview the captured image and download it when it looks right.",
      ],
      example:
        "A creator opens a 40-second MP4, seeks to 00:12, extracts that frame as a PNG at the video's native 1920 × 1080 resolution, and uses it as a thumbnail.",
      benefits: [
        "Make thumbnails without installing video editing software.",
        "Native-resolution capture keeps text and detail sharp.",
        "JPEG quality control helps meet upload size limits.",
        "Private by design: the video stays in your browser.",
      ],
      faqs: [
        {
          q: "Which video formats work?",
          a: "MP4, WebM, OGG, and MOV are accepted, but actual playback depends on your browser's codec support. If the preview fails, try an MP4 (H.264) or WebM file.",
        },
        {
          q: "Why is the timeline disabled?",
          a: "The timeline becomes active once the browser has read the video metadata and knows its duration. Large files may take a moment to load.",
        },
        {
          q: "Can I capture a frame from a streaming URL?",
          a: "No. Only local files can be chosen. Remote video URLs are not supported because cross-origin restrictions can block canvas access.",
        },
        {
          q: "Does extraction change the frame size?",
          a: "No. The image is saved at the video's native pixel dimensions. Use the Image Resizer afterward if you need a smaller thumbnail.",
        },
      ],
    },
  },
];
