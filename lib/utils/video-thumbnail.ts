/** Pure helpers for extracting a video frame with Canvas. */

import { MAX_VIDEO_UPLOAD_BYTES } from "@/constants/limits";
import { formatBytes } from "@/lib/utils/format";
import { canvasToBlob } from "@/lib/utils/image";

const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

export function validateVideoFile(file: File): string | null {
  if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
    return "Unsupported file type. Choose an MP4, WebM, OGG, or MOV video.";
  }
  if (file.size === 0) return "That file is empty. Choose another video.";
  if (file.size > MAX_VIDEO_UPLOAD_BYTES) {
    return `That video is ${formatBytes(file.size)}. The maximum is ${formatBytes(MAX_VIDEO_UPLOAD_BYTES)}.`;
  }
  return null;
}

/** Formats seconds as m:ss for the timeline label. */
export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Seeks a video element and resolves once the new frame is ready. */
export function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("The video could not be seeked to that time."));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    const target = Math.max(0, Math.min(time, Number.isFinite(video.duration) ? video.duration : time));
    if (Math.abs(video.currentTime - target) < 0.001) {
      cleanup();
      resolve();
      return;
    }
    video.currentTime = target;
  });
}

/** Draws the current video frame to a canvas and encodes it as an image blob. */
export async function captureFrame(
  video: HTMLVideoElement,
  type: "image/png" | "image/jpeg",
  quality: number,
  baseName: string,
): Promise<{ blob: Blob; url: string; filename: string }> {
  if (!video.videoWidth || !video.videoHeight) {
    throw new Error("The video frame is not ready yet. Try again in a moment.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas, type, quality);
  const extension = type === "image/png" ? "png" : "jpg";
  const safeBase = baseName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "thumbnail";

  return {
    blob,
    url: URL.createObjectURL(blob),
    filename: `${safeBase}-thumbnail.${extension}`,
  };
}
