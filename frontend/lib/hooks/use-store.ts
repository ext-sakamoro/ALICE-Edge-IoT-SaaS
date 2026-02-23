"use client";

import { create } from "zustand";

interface EdgeStore {
  // Compression settings
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;

  level: number;
  setLevel: (level: number) => void;

  // Data
  data: string;
  setData: (data: string) => void;

  result: string | null;
  setResult: (result: string | null) => void;

  // UI state
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

const DEFAULT_ALGORITHM = "lz4";
const DEFAULT_LEVEL = 6;

export const useEdgeStore = create<EdgeStore>((set) => ({
  algorithm: DEFAULT_ALGORITHM,
  setAlgorithm: (algorithm) => set({ algorithm }),

  level: DEFAULT_LEVEL,
  setLevel: (level) => set({ level }),

  data: "",
  setData: (data) => set({ data }),

  result: null,
  setResult: (result) => set({ result }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  reset: () =>
    set({
      algorithm: DEFAULT_ALGORITHM,
      level: DEFAULT_LEVEL,
      data: "",
      result: null,
      loading: false,
    }),
}));
