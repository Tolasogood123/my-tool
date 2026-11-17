import type { Tool } from "@/types/tool";

/** Stage 3, Round 6 tools (browser-side image processing). */
export const stage3Round6Tools: Tool[] = [
  {
    slug: "image-format-converter",
    title: "Image to WebP / PNG / JPG",
    description:
      "Convert images between WebP, PNG and JPG in your browser. Adjust quality, preview the result and download a clean file without uploading anything.",
    category: "image-design",
    keywords: ["image format converter", "jpg to webp", "png to jpg", "webp to png", "convert image online"],
    icon: "ImageDown",
    status: "ready",
    popularity: 91,
    addedAt: "2026-11-20",
    related: ["image-compressor", "image-resizer", "exif-remover"],
    content: {
      what: "The Image Format Converter re-encodes a JPG, PNG or WebP file into another browser-supported format using the Canvas API. You can choose WebP, JPEG or PNG and set quality for lossy formats. The original pixels stay the same size, and the converted file is built locally so your image never leaves the device.",
      howTo: [
        "Choose a JPG, PNG or WebP image up to 20 MB.",
        "Select the output format and, for JPEG or WebP, a quality level.",
        "Click Convert image and wait for the preview.",
        "Download the converted file when you are happy with it.",
      ],
      example:
        "A designer receives a 3 MB PNG screenshot and converts it to WebP at 85% quality, producing a much smaller file that still looks sharp on the web.",
      benefits: [
        "Prepare images for different platforms without installing software.",
        "WebP output often cuts file size substantially.",
        "No uploads, watermarks or daily limits.",
        "Works on phones and desktops with a clear file-size error.",
      ],
      faqs: [
        {
          q: "Does conversion change image dimensions?",
          a: "No. Pixel width and height stay the same. Use the Image Resizer if you need different dimensions.",
        },
        {
          q: "Why does the quality slider not affect PNG?",
          a: "PNG is lossless, so quality has no meaning. Choose WebP or JPEG when a smaller file matters more than perfect pixel fidelity.",
        },
        {
          q: "Are transparent images supported?",
          a: "JPEG has no transparency, so transparent areas become solid when exporting to JPEG. PNG and WebP preserve transparency.",
        },
        {
          q: "What happens to embedded metadata?",
          a: "Canvas re-encoding keeps pixel data only, so most metadata is dropped. Use the EXIF Remover when metadata removal is your main goal.",
        },
      ],
    },
  },
  {
    slug: "image-cropper",
    title: "Image Cropper",
    description:
      "Crop an image to an exact pixel rectangle in your browser. Use full, square, 16:9 or 4:3 presets, then fine-tune and download the result.",
    category: "image-design",
    keywords: ["image cropper", "crop image online", "crop photo", "aspect ratio cropper", "crop jpg png webp"],
    icon: "Crop",
    status: "ready",
    popularity: 87,
    addedAt: "2026-11-20",
    related: ["image-resizer", "image-format-converter", "qr-code-generator"],
    content: {
      what: "The Image Cropper keeps a chosen rectangle of your image and discards the rest. Enter pixel coordinates for the left edge, top edge, width and height, or start with a preset aspect ratio such as 1:1 or 16:9. The crop is rendered through canvas and downloaded directly from your browser.",
      howTo: [
        "Upload a JPG, PNG or WebP image up to 20 MB.",
        "Pick a preset aspect ratio or enter exact crop pixels.",
        "Adjust the left and top offsets to position the crop.",
        "Click Crop image and download the result.",
      ],
      example:
        "A 1920 × 1080 screenshot needs a square thumbnail. The 1:1 preset centers a 1080 × 1080 crop, which the user can move left or right before exporting.",
      benefits: [
        "Make thumbnails and social previews without desktop software.",
        "Presets save time on common aspect ratios.",
        "Explicit pixel values give precise control when needed.",
        "Files stay on your device throughout.",
      ],
      faqs: [
        {
          q: "What if my crop extends past the image edge?",
          a: "The tool validates the rectangle before processing and shows a clear error. Reduce the width, height or offsets so the crop fits inside the image.",
        },
        {
          q: "Can I crop a rotated image?",
          a: "Not directly. Crop works on the image as stored. Rotate the source file first with an image editor, then crop it here.",
        },
        {
          q: "Does cropping reduce quality?",
          a: "Cropping keeps the original pixels inside the selected rectangle, so there is no extra quality loss beyond any lossy output format you choose.",
        },
        {
          q: "Is there a minimum size?",
          a: "Width and height must each be at least 1 pixel. Very large source images are limited by your device's browser canvas limits.",
        },
      ],
    },
  },
  {
    slug: "exif-remover",
    title: "EXIF Remover",
    description:
      "Strip embedded metadata from photos by re-encoding them in your browser. Choose an output format and download a cleaner image privately.",
    category: "image-design",
    keywords: ["exif remover", "remove image metadata", "strip exif", "photo privacy tool", "remove gps from photo"],
    icon: "ShieldCheck",
    status: "ready",
    popularity: 88,
    addedAt: "2026-11-20",
    related: ["image-format-converter", "image-compressor", "password-generator"],
    content: {
      what: "The EXIF Remover re-encodes an image from its pixel data, which removes common embedded metadata such as camera model, timestamps, GPS coordinates and thumbnails. It runs entirely in your browser. This is a practical privacy tool, not a forensic guarantee: some image structures or software may reintroduce metadata later.",
      howTo: [
        "Upload a JPG, PNG or WebP image up to 20 MB.",
        "Choose the output format; WebP or JPEG usually keeps files small.",
        "Click Remove metadata and review the preview.",
        "Download the clean copy and keep the original if you need it.",
      ],
      example:
        "A phone photo contains GPS coordinates in its EXIF block. Re-encoding it through the tool produces a visually identical file without that location data.",
      benefits: [
        "Share photos without accidentally revealing location data.",
        "No upload means your original never reaches a server.",
        "Simple one-click process with a clear preview.",
        "Combine with the format converter to also reduce file size.",
      ],
      faqs: [
        {
          q: "Is all metadata guaranteed to be gone?",
          a: "Re-encoding through canvas removes the standard metadata blocks found in JPG, PNG and WebP files. It cannot guarantee that every possible custom chunk or later editing step leaves none behind.",
        },
        {
          q: "Will the image look different?",
          a: "Visually it should look the same, though lossy formats such as JPEG and WebP recompress pixels. Choose a high quality setting or PNG if exact pixel fidelity matters.",
        },
        {
          q: "Does this remove watermarks?",
          a: "No. A visible watermark is part of the pixels. This tool only removes embedded metadata, not visual content.",
        },
        {
          q: "Do you keep a copy of my original?",
          a: "No. The file is read in browser memory and discarded when you leave or reset the tool.",
        },
      ],
    },
  },
];
