import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { CmsStore } from "./types";

const STORE_PATH = path.join(process.cwd(), "data", "cms-store.json");

/** Minimal empty store used as a last-resort fallback. */
const EMPTY_STORE: CmsStore = {
  version: 1,
  updatedAt: new Date().toISOString(),
  testimonials: [],
  blogs: [],
  pricingPlans: [],
  contactSubmissions: [],
};

let writeQueue: Promise<void> = Promise.resolve();

async function ensureStoreDirectory() {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
}

async function persistStore(store: CmsStore) {
  await ensureStoreDirectory();
  await writeFile(STORE_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function readCmsStore(): Promise<CmsStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    // Strip UTF-8 BOM (\uFEFF) if present — JSON.parse cannot handle it.
    const fileContents = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    return JSON.parse(fileContents) as CmsStore;
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      // File doesn't exist yet — seed it and return the empty store.
      await persistStore(EMPTY_STORE);
      return EMPTY_STORE;
    }
    // JSON parse error or unexpected error — log and return empty store.
    console.error(
      "[CMS] Failed to read cms-store.json from",
      STORE_PATH,
      error,
    );
    return EMPTY_STORE;
  }
}

export async function writeCmsStore(store: CmsStore): Promise<CmsStore> {
  await persistStore(store);
  return store;
}

export async function mutateCmsStore<T>(
  mutator: (draft: CmsStore) => Promise<T> | T,
): Promise<T> {
  let result: T | undefined;

  writeQueue = writeQueue
    .catch(() => undefined)
    .then(async () => {
      const store = await readCmsStore();
      result = await mutator(store);
      store.updatedAt = new Date().toISOString();
      await persistStore(store);
    });

  await writeQueue;

  if (typeof result === "undefined") {
    throw new Error("Unable to update CMS store.");
  }

  return result;
}
