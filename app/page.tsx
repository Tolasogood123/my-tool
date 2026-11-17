import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FAQ } from "@/components/home/FAQ";
import { FeaturedAI } from "@/components/home/FeaturedAI";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LatestGuides } from "@/components/home/LatestGuides";
import { PersonalRow } from "@/components/home/PersonalRow";
import { PopularTools } from "@/components/home/PopularTools";
import { RecentTools } from "@/components/home/RecentTools";
import { StatsStrip } from "@/components/home/StatsStrip";
import { WhyChoose } from "@/components/home/WhyChoose";
import { buttonClassName } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <PersonalRow kind="recent" />
      <PersonalRow kind="favorites" />
      <PopularTools />
      <CategoryGrid />
      <RecentTools />
      <WhyChoose />
      <HowItWorks />

      <section className="container-page py-16 lg:py-20">
        <div className="relative overflow-hidden rounded-card border border-border bg-surface p-8 shadow-card sm:p-10">
          <div className="hero-glow absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to get something done?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Open the full collection and pick the tool that fits your task.
                No account, no uploads for local tools.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tools"
                className={buttonClassName({ size: "lg" })}
              >
                Explore All Tools
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/#categories"
                className={buttonClassName({ size: "lg", variant: "outline" })}
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
      <LatestGuides />
      <FeaturedAI />
    </>
  );
}
