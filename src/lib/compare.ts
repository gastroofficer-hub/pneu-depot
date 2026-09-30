import { useSyncExternalStore } from "react";

const KEY = "pneudepot-compare";
export const MAX_COMPARE = 4;
const listeners = new Set<() => void>();
let cache: string[] | null = null;
const EMPTY: string[] = [];

function read(): string[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

function write(ids: string[]) {
  cache = ids;
  localStorage.setItem(KEY, JSON.stringify(ids));
  listeners.forEach((l) => l());
}

export function toggleCompare(slug: string) {
  const ids = read();
  if (ids.includes(slug)) write(ids.filter((s) => s !== slug));
  else if (ids.length < MAX_COMPARE) write([...ids, slug]);
}
export const removeCompare = (slug: string) => write(read().filter((s) => s !== slug));
export const clearCompare = () => write([]);

export function useCompare() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
}
