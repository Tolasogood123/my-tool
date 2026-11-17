export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  content: string;
}

import { batchGBlogs } from "./blog-batch-g";
import { batchHBlogs } from "./blog-batch-h";
import { batchIBlogs } from "./blog-batch-i";
import { batchJBlogs } from "./blog-batch-j";
import { batchKBlogs } from "./blog-batch-k";
import { batchLBlogs } from "./blog-batch-l";
import { batchMBlogs } from "./blog-batch-m";
import { batchNBlogs } from "./blog-batch-n";
import { batchOBlogs } from "./blog-batch-o";
import { batchPBlogs } from "./blog-batch-p";
import { batchQBlogs } from "./blog-batch-q";

export const blogPosts: BlogPost[] = [
  ...batchGBlogs,
  ...batchHBlogs,
  ...batchIBlogs,
  ...batchJBlogs,
  ...batchKBlogs,
  ...batchLBlogs,
  ...batchMBlogs,
  ...batchNBlogs,
  ...batchOBlogs,
  ...batchPBlogs,
  ...batchQBlogs,
  {
    slug: "compress-images-for-the-web",
    title: "How to Compress Images for the Web Without Losing Quality",
    description:
      "A practical guide to choosing formats, quality settings, and dimensions so your images load fast without looking blurry or washed out.",
    date: "2026-11-10",
    readingMinutes: 6,
    tags: ["Images", "Performance", "Web"],
    content: `Every unnecessary kilobyte makes your website slower. Images are usually the biggest part of a page, and most of them are far larger than they need to be. The good news is that you can fix this without expensive software.

## Start with the right dimensions

Compression cannot fix an image that is simply too large. A 6000-pixel-wide photo displayed in a 600-pixel column still wastes bandwidth even after compression. Resize first, then compress.

A useful rule: export images at roughly twice the largest size they will appear on screen. That keeps them sharp on high-density displays without shipping absurdly large files.

## Choose the right format

- **JPEG** is still excellent for photographs. It is widely supported and compresses smooth gradients well.
- **WebP** usually produces smaller files than JPEG at similar quality and supports transparency. Modern browsers all support it.
- **PNG** is best for logos, icons, and screenshots with sharp edges or transparency. Photographs stored as PNG are often many times larger than necessary.
- **AVIF** can be even smaller than WebP, but encoding is slower and support is less universal. Use it with a fallback if you need maximum savings.

## Quality settings that actually work

For photographs, a quality setting between 70 and 82 is usually the sweet spot. Below 65, skies and skin tones start to show blocky artifacts. Above 85, file size grows quickly for gains most people cannot see.

Test on the actual image rather than trusting a preset. A detailed landscape and a flat product photo behave differently.

## Remove metadata you do not need

Photos from phones and cameras can contain large blocks of metadata, including thumbnails and location information. Stripping metadata reduces size and protects privacy. Browser-based canvas re-encoding removes most of it automatically, but it also removes useful color profiles, so compare the result if color accuracy matters.

## Compress in the browser

The [TolaDev Image Compressor](/tools/image-compressor) runs entirely on your device. You can adjust quality, compare sizes, and download the result without uploading anything. That is faster on slow connections and keeps private photos private.

## A simple workflow

1. Resize to the display size you actually need.
2. Pick WebP for general use, JPEG for maximum compatibility, PNG for graphics.
3. Compress at around 75–80% quality.
4. Compare the result at 100% zoom before publishing.
5. Keep the original file in case you need to export again.

Small changes add up. A page with ten images that each drop from 1.5 MB to 250 KB becomes roughly 12 MB lighter, which is the difference between a frustrating wait and an instant load on mobile data.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getSortedBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}
