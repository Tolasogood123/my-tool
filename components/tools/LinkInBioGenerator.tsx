"use client";

import { useMemo, useState } from "react";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  generateBioHtml,
  sanitizeColor,
  sanitizeUrl,
} from "@/lib/utils/link-in-bio";
import type { BioLink, BioProfile } from "@/lib/utils/link-in-bio";

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `link-${Date.now()}-${nextId}`;
}

function newLink(): BioLink {
  return { id: makeId(), label: "", url: "" };
}

const emptyProfile: BioProfile = {
  name: "",
  handle: "",
  bio: "",
  avatarUrl: "",
  theme: "dark",
  accentColor: "#6366f1",
  links: [newLink()],
};

export function LinkInBioGenerator() {
  const [profile, setProfile] = useState<BioProfile>(emptyProfile);

  const update = (patch: Partial<BioProfile>) =>
    setProfile((current) => ({ ...current, ...patch }));

  const updateLink = (id: string, patch: Partial<BioLink>) =>
    setProfile((current) => ({
      ...current,
      links: current.links.map((link) =>
        link.id === id ? { ...link, ...patch } : link,
      ),
    }));

  const addLink = () =>
    setProfile((current) => ({ ...current, links: [...current.links, newLink()] }));

  const removeLink = (id: string) =>
    setProfile((current) => ({
      ...current,
      links: current.links.filter((link) => link.id !== id),
    }));

  const reset = () => setProfile({ ...emptyProfile, links: [newLink()] });

  const html = useMemo(() => generateBioHtml(profile), [profile]);
  const accent = sanitizeColor(profile.accentColor);
  const avatar = sanitizeUrl(profile.avatarUrl);
  const handle = profile.handle.trim().replace(/^@/, "");
  const visibleLinks = profile.links.filter(
    (link) => sanitizeUrl(link.url) && (link.label.trim() || link.url.trim()),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name" htmlFor="bio-name">
            <Input
              id="bio-name"
              value={profile.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder="Alex Rivera"
            />
          </Field>
          <Field label="Handle" htmlFor="bio-handle" hint="Without the @ symbol.">
            <Input
              id="bio-handle"
              value={profile.handle}
              onChange={(event) => update({ handle: event.target.value })}
              placeholder="alexrivera"
            />
          </Field>
        </div>

        <Field label="Short bio" htmlFor="bio-text">
          <Textarea
            id="bio-text"
            rows={3}
            value={profile.bio}
            onChange={(event) => update({ bio: event.target.value })}
            placeholder="Designer, coffee enthusiast, and weekly newsletter writer."
          />
        </Field>

        <Field
          label="Avatar image URL"
          htmlFor="bio-avatar"
          hint="A full https:// image URL. Only http(s), mailto, tel, and relative URLs are accepted."
        >
          <Input
            id="bio-avatar"
            type="url"
            value={profile.avatarUrl}
            onChange={(event) => update({ avatarUrl: event.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Theme" htmlFor="bio-theme">
            <Select
              id="bio-theme"
              value={profile.theme}
              onChange={(event) =>
                update({ theme: event.target.value as BioProfile["theme"] })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          </Field>
          <Field label="Accent color" htmlFor="bio-color">
            <input
              id="bio-color"
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(profile.accentColor) ? profile.accentColor : accent}
              onChange={(event) => update({ accentColor: event.target.value })}
              className="h-10 w-full cursor-pointer rounded-control border border-border bg-surface p-1"
            />
          </Field>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Links</h3>
            <Button variant="outline" size="sm" onClick={addLink}>
              <Plus className="size-3.5" aria-hidden="true" />
              Add link
            </Button>
          </div>
          {profile.links.map((link, index) => (
            <div
              key={link.id}
              className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
            >
              <Input
                aria-label={`Label for link ${index + 1}`}
                value={link.label}
                onChange={(event) => updateLink(link.id, { label: event.target.value })}
                placeholder="Read my newsletter"
              />
              <Input
                aria-label={`URL for link ${index + 1}`}
                type="url"
                value={link.url}
                onChange={(event) => updateLink(link.id, { url: event.target.value })}
                placeholder="https://example.com"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLink(link.id)}
                aria-label={`Remove link ${index + 1}`}
                className="size-10 shrink-0"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
          <p className="text-xs text-subtle-foreground">
            Links with an empty or unsafe URL are left out of the exported page.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface-muted p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle-foreground">
            Live preview
          </p>
          <div className="mx-auto max-w-sm rounded-card border border-border bg-surface p-6 text-center">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- sanitized user preview URL
              <img
                src={avatar}
                alt={profile.name || "Profile avatar"}
                className="mx-auto size-20 rounded-full border-[3px] object-cover"
                style={{ borderColor: accent }}
              />
            ) : null}
            <h3 className="mt-3 text-lg font-semibold">
              {profile.name.trim() || "Your name"}
            </h3>
            {handle ? (
              <p className="text-sm text-muted-foreground">@{handle}</p>
            ) : null}
            {profile.bio.trim() ? (
              <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                {profile.bio}
              </p>
            ) : null}
            <div className="mt-5 grid gap-2">
              {visibleLinks.map((link) => {
                const safe = sanitizeUrl(link.url);
                const external = /^https?:/.test(safe);
                return (
                  <a
                    key={link.id}
                    href={safe}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="block rounded-control border px-4 py-3 text-sm font-semibold transition-colors hover:bg-surface-muted"
                    style={{ borderColor: accent }}
                  >
                    {link.label.trim() || safe}
                  </a>
                );
              })}
              {visibleLinks.length === 0 ? (
                <p className="text-xs text-subtle-foreground">Your links will appear here.</p>
              ) : null}
            </div>
          </div>
        </div>

        <ToolOutput
          label="Self-contained HTML"
          value={html}
          filename={`${handle || "my-links"}.html`}
          mimeType="text/html;charset=utf-8"
          rows={12}
          placeholder="Your exported page will appear here."
        />
      </div>
    </div>
  );
}
