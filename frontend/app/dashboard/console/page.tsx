"use client";

import { useState } from "react";
import { useEdgeStore } from "@/lib/hooks/use-store";
import { EdgeClient } from "@/lib/api/client";

const client = new EdgeClient();

export default function EdgeConsolePage() {
  const {
    algorithm,
    setAlgorithm,
    level,
    setLevel,
    data,
    setData,
    result,
    setResult,
    loading,
    setLoading,
  } = useEdgeStore();

  const [error, setError] = useState<string | null>(null);

  async function handleCompress() {
    if (!data.trim()) {
      setError("Please enter data to compress.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await client.compress({ data, algorithm, level });
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDecompress() {
    if (!data.trim()) {
      setError("Please enter data to decompress.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await client.decompress({ data, algorithm });
      setResult(JSON.stringify(res, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decompression failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-cyan-400">
          Edge Console
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Compress and decompress IoT payloads at the edge
        </p>
      </header>

      <div className="mx-auto max-w-5xl px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Controls */}
          <section className="flex flex-col gap-6">
            {/* Data input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Data Input
              </label>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                rows={8}
                placeholder="Paste IoT payload here..."
                className="w-full resize-none rounded-lg border border-white/15 bg-white/5 p-3 font-mono text-sm text-gray-100 placeholder-gray-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Algorithm selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-gray-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="lz4">LZ4 — Ultra-fast</option>
                <option value="zstd">Zstandard — Balanced</option>
                <option value="brotli">Brotli — High ratio</option>
                <option value="snappy">Snappy — Google speed</option>
              </select>
            </div>

            {/* Compression level slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Compression Level
                </label>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-xs text-cyan-300">
                  {level}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={22}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-600">
                <span>0 — Fast</span>
                <span>22 — Max ratio</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCompress}
                disabled={loading}
                className="flex-1 rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-gray-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Compress"}
              </button>
              <button
                onClick={handleDecompress}
                disabled={loading}
                className="flex-1 rounded-lg border border-cyan-500/50 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/10 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Decompress"}
              </button>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
          </section>

          {/* Result panel */}
          <section>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Result
            </label>
            <div className="min-h-[24rem] rounded-lg border border-white/10 bg-black/40 p-4">
              {result ? (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-green-300">
                  {result}
                </pre>
              ) : (
                <p className="mt-16 text-center text-sm text-gray-600">
                  Results will appear here after compression or decompression.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
