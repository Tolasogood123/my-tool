export const SITE = {
  name: "TolaDev",
  tagline: "Free Tools. Smarter Work. Anywhere.",
  description:
    "TolaDev is a free, all-in-one collection of online tools for students, developers, freelancers, creators, and business owners. Fast, private, and no sign-up required.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://toladev.com",
  locale: "en_US",
  email: "hello@toladev.com",
  twitter: "@toladev",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "All Tools", href: "/tools" },
  { label: "Categories", href: "/#categories" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerLinks: { title: string; links: NavLink[] }[] = [
  {
    title: "Tools",
    links: [
      { label: "All Tools", href: "/tools" },
      { label: "Image & Design", href: "/category/image-design" },
      { label: "Developer", href: "/category/developer" },
      { label: "Student & Education", href: "/category/student-education" },
      { label: "Security & Privacy", href: "/category/security-privacy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];
