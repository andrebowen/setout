import { create } from "zustand";
import type { Inputs } from "@/lib/calc";

export type SavedJob = {
  id: string;
  name: string;
  slug: string;
  inputs: Inputs;
  headline: string;
  savedAt: number;
};

type Persisted = {
  recents: string[];
  inputsBySlug: Record<string, Inputs>;
  jobs: SavedJob[];
};

type Store = Persisted & {
  hydrated: boolean;
  hydrate: () => void;
  touchRecent: (slug: string) => void;
  setInputs: (slug: string, inputs: Inputs) => void;
  saveJob: (job: Omit<SavedJob, "id" | "savedAt">) => string;
  deleteJob: (id: string) => void;
  renameJob: (id: string, name: string) => void;
};

const KEY = "setout.v1";

function load(): Persisted {
  const empty: Persisted = { recents: [], inputsBySlug: {}, jobs: [] };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      recents: Array.isArray(parsed.recents) ? parsed.recents : [],
      inputsBySlug: parsed.inputsBySlug && typeof parsed.inputsBySlug === "object" ? parsed.inputsBySlug : {},
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
    };
  } catch {
    return empty;
  }
}

function persist(state: Store) {
  if (typeof window === "undefined") return;
  const data: Persisted = {
    recents: state.recents,
    inputsBySlug: state.inputsBySlug,
    jobs: state.jobs,
  };
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export const useStore = create<Store>((set, get) => ({
  recents: [],
  inputsBySlug: {},
  jobs: [],
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    set({ ...load(), hydrated: true });
  },
  touchRecent: (slug) => {
    set((s) => ({
      recents: [slug, ...s.recents.filter((x) => x !== slug)].slice(0, 8),
    }));
    persist(get());
  },
  setInputs: (slug, inputs) => {
    set((s) => ({ inputsBySlug: { ...s.inputsBySlug, [slug]: inputs } }));
    persist(get());
  },
  saveJob: (job) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `job-${Date.now()}`;
    set((s) => ({
      jobs: [{ ...job, id, savedAt: Date.now() }, ...s.jobs].slice(0, 40),
    }));
    persist(get());
    return id;
  },
  deleteJob: (id) => {
    set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) }));
    persist(get());
  },
  renameJob: (id, name) => {
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, name } : j)),
    }));
    persist(get());
  },
}));
