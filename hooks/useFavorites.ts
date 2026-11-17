"use client";

import { useCallback, useSyncExternalStore } from "react";

export const FAVORITES_STORAGE_KEY = "toladev-favorites";
const FAVORITES_EVENT = "toladev-favorites-change";

function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parseFavorites(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeFavorites(slugs: string[]): void {
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // If storage is blocked, favorites still work for this session.
  }
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_STORAGE_KEY) callback();
  };
  window.addEventListener(FAVORITES_EVENT, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(FAVORITES_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

const emptyFavorites: string[] = [];
let cachedRaw: string | null | undefined;
let cachedValue: string[] = emptyFavorites;

function getSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
  } catch {
    return emptyFavorites;
  }
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parseFavorites(raw);
  return cachedValue;
}

function getServerSnapshot(): string[] {
  return emptyFavorites;
}

function subscribeReady() {
  return () => {};
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeReady, () => true, () => false);

  const toggleFavorite = useCallback((slug: string) => {
    const current = readFavorites();
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    writeFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites],
  );

  return { favorites, isFavorite, toggleFavorite, ready };
}
