"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "toladev-recently-used";
const EVENT = "toladev-recently-used-change";
const MAX_ITEMS = 12;

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value
      .filter((item): item is string => typeof item === "string")
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback();
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

const empty: string[] = [];
let cachedRaw: string | null | undefined;
let cachedValue: string[] = empty;

function getSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return empty;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parse(raw);
  return cachedValue;
}

export function useRecentlyUsed() {
  const recent = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  const recordTool = useCallback((slug: string) => {
    try {
      const next = [slug, ...read().filter((item) => item !== slug)].slice(0, MAX_ITEMS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage may be blocked; the tool still works for this session.
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { recent, ready, recordTool };
}
