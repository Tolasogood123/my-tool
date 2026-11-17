"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ErrorState } from "@/components/ui/ErrorState";
import { useToast } from "@/components/ui/Toast";
import { ToolOutput } from "@/components/tools/ToolOutput";
import {
  CALENDAR_PLATFORMS,
  CALENDAR_WEEKDAYS,
  getMonthGrid,
  monthLabel,
  postsToCsv,
  validatePost,
} from "@/lib/utils/content-calendar";
import type { CalendarPost } from "@/lib/utils/content-calendar";

let nextId = 0;
function makeId(): string {
  nextId += 1;
  return `post-${Date.now()}-${nextId}`;
}

function todayParts() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
  };
}

interface PostForm {
  date: string;
  title: string;
  platform: string;
  time: string;
  notes: string;
}

export function ContentCalendarGenerator() {
  const initial = useMemo(() => todayParts(), []);
  const [view, setView] = useState({ year: initial.year, month: initial.month });
  const [form, setForm] = useState<PostForm>({
    date: initial.date,
    title: "",
    platform: CALENDAR_PLATFORMS[0],
    time: "",
    notes: "",
  });
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(initial.date);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const weeks = useMemo(
    () => getMonthGrid(view.year, view.month),
    [view.year, view.month],
  );

  const postsByDate = useMemo(() => {
    const map = new Map<string, CalendarPost[]>();
    for (const post of posts) {
      const list = map.get(post.date) ?? [];
      list.push(post);
      map.set(post.date, list);
    }
    return map;
  }, [posts]);

  const sortedPosts = useMemo(
    () =>
      [...posts].sort(
        (a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
      ),
    [posts],
  );

  const csv = sortedPosts.length ? postsToCsv(sortedPosts) : "";

  const update = (patch: Partial<PostForm>) => setForm((current) => ({ ...current, ...patch }));

  const changeMonth = (offset: number) => {
    setView((current) => {
      const next = new Date(Date.UTC(current.year, current.month + offset, 1));
      return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
    });
  };

  const goToday = () => {
    const parts = todayParts();
    setView({ year: parts.year, month: parts.month });
  };

  const selectDate = (date: string) => {
    setSelectedDate(date);
    update({ date });
    setError(null);
  };

  const addPost = () => {
    const validation = validatePost(form);
    if (validation) {
      setError(validation);
      return;
    }
    const post: CalendarPost = {
      id: makeId(),
      date: form.date,
      title: form.title.trim(),
      platform: form.platform,
      time: form.time.trim(),
      notes: form.notes.trim(),
    };
    setPosts((current) => [...current, post]);
    setForm((current) => ({ ...current, title: "", notes: "" }));
    setSelectedDate(post.date);
    setError(null);
    toast({ title: "Post added to the calendar", variant: "success" });
  };

  const removePost = (id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id));
  };

  const reset = () => {
    const parts = todayParts();
    setView({ year: parts.year, month: parts.month });
    setForm({ date: parts.date, title: "", platform: CALENDAR_PLATFORMS[0], time: "", notes: "" });
    setSelectedDate(parts.date);
    setPosts([]);
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Field
          label="Post date"
          htmlFor="calendar-date"
          hint="Click any day in the calendar to fill this field."
        >
          <Input
            id="calendar-date"
            type="date"
            value={form.date}
            onChange={(event) => {
              update({ date: event.target.value });
              setSelectedDate(event.target.value);
            }}
          />
        </Field>
        <Field label="Post title" htmlFor="calendar-title" required>
          <Input
            id="calendar-title"
            value={form.title}
            onChange={(event) => update({ title: event.target.value })}
            placeholder="Spring launch teaser"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Platform" htmlFor="calendar-platform">
            <Select
              id="calendar-platform"
              value={form.platform}
              onChange={(event) => update({ platform: event.target.value })}
            >
              {CALENDAR_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Publish time" htmlFor="calendar-time">
            <Input
              id="calendar-time"
              type="time"
              value={form.time}
              onChange={(event) => update({ time: event.target.value })}
            />
          </Field>
        </div>
        <Field label="Notes" htmlFor="calendar-notes" hint="Optional caption ideas, links, or assets.">
          <Textarea
            id="calendar-notes"
            rows={2}
            value={form.notes}
            onChange={(event) => update({ notes: event.target.value })}
            placeholder="Use the new product photos; add a poll sticker."
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button onClick={addPost}>
            <Plus className="size-4" aria-hidden="true" />
            Add post
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </Button>
        </div>

        {error ? (
          <ErrorState title="Check the post details" description={error} icon={CalendarDays} />
        ) : null}

        <div className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Scheduled posts</h3>
            <span className="text-xs text-muted-foreground">{posts.length} total</span>
          </div>
          {posts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing scheduled yet. Add a post and it will appear here.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {sortedPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-2 rounded-control border border-border bg-surface-muted px-3 py-2 text-sm"
                >
                  <span className="min-w-0">
                    <span className="font-medium">{post.date}</span>
                    <span className="mx-2 text-subtle-foreground">·</span>
                    <span className="break-words">{post.title}</span>
                    <span className="block text-xs text-subtle-foreground">
                      {post.platform}
                      {post.time ? ` · ${post.time}` : ""}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePost(post.id)}
                    aria-label={`Remove ${post.title}`}
                    className="size-8 shrink-0"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-card border border-border bg-surface p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold">{monthLabel(view.year, view.month)}</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => changeMonth(-1)} aria-label="Previous month">
                <ChevronLeft className="size-4" aria-hidden="true" />
                Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={goToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => changeMonth(1)} aria-label="Next month">
                Next
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {CALENDAR_WEEKDAYS.map((day) => (
              <div
                key={day}
                className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wide text-subtle-foreground"
              >
                {day}
              </div>
            ))}
            {weeks.flat().map((cell, index) => {
              if (!cell.date || cell.day === null) {
                return (
                  <div
                    key={`blank-${index}`}
                    className="min-h-14 rounded-control bg-surface-muted/60 sm:min-h-16"
                    aria-hidden="true"
                  />
                );
              }
              const dayPosts = postsByDate.get(cell.date) ?? [];
              const isSelected = selectedDate === cell.date;
              const isToday = cell.date === initial.date;
              return (
                <button
                  key={cell.date}
                  type="button"
                  onClick={() => selectDate(cell.date as string)}
                  aria-label={`${monthLabel(view.year, view.month)} ${cell.day}, ${dayPosts.length} post${dayPosts.length === 1 ? "" : "s"}`}
                  aria-pressed={isSelected}
                  className={`flex min-h-14 min-w-0 flex-col items-start gap-0.5 overflow-hidden rounded-control border p-1 text-left text-xs transition-colors sm:min-h-16 ${
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border bg-surface hover:bg-surface-muted"
                  } ${isToday ? "ring-1 ring-accent/60" : ""}`}
                >
                  <span className="font-semibold">{cell.day}</span>
                  {dayPosts.slice(0, 2).map((post) => (
                    <span
                      key={post.id}
                      className="block w-full truncate rounded bg-accent/10 px-1 text-[10px] text-foreground"
                      title={post.title}
                    >
                      {post.title}
                    </span>
                  ))}
                  {dayPosts.length > 2 ? (
                    <span className="text-[10px] text-subtle-foreground">
                      +{dayPosts.length - 2} more
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-subtle-foreground">
            Your calendar and posts stay in this browser tab. Export a CSV to keep or share them.
          </p>
        </div>

        <ToolOutput
          label="Calendar CSV"
          value={csv}
          filename="content-calendar.csv"
          mimeType="text/csv;charset=utf-8"
          rows={8}
          placeholder="Add a post, then export the calendar as CSV."
        />
      </div>
    </div>
  );
}
