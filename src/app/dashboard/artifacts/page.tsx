"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@/lib/theme";
import { MarkdownViewer } from "@/components/markdown/viewer";
import { ArtifactActions } from "@/components/dashboard/actions";
import { getTypeLabel, getTypeColor, ALL_TYPE_VALUES } from "@/lib/artifact-types";

interface Artifact {
  id: string;
  title: string;
  slug: string;
  type: string;
  content: string;
  metadata: string | null;
  tags: string | null;
  filePath: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ArtifactsPage() {
  const { isDark } = useTheme();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Artifact | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadArtifacts = useCallback((type: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const url = type === "all" ? "/api/artifacts" : `/api/artifacts?type=${type}`;
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setArtifacts(Array.isArray(d) ? d : d.data || []))
      .catch((err) => {
        if (err.name !== "AbortError") setArtifacts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadArtifacts(filter);
  }, [filter, loadArtifacts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Artefactos</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {artifacts.length} artefacto{artifacts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ALL_TYPE_VALUES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === t
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {t === "all" ? "Todos" : getTypeLabel(t)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
        </div>
      ) : artifacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">No hay artefactos para este filtro</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">Título</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {artifacts.map((a) => (
                    <tr
                      key={a.id}
                      className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      onClick={() => setSelected(a)}
                    >
                      <td className="px-4 py-3 font-medium">{a.title}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(a.type)}`}
                        >
                          {getTypeLabel(a.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{a.slug}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(a.createdAt).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-4 py-3">
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {artifacts.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-full rounded-xl border border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{a.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getTypeColor(a.type)}`}
                  >
                    {getTypeLabel(a.type)}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-500">{a.slug}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl dark:bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold">{selected.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(selected.type)}`}
                  >
                    {getTypeLabel(selected.type)}
                  </span>
                  <span className="text-xs text-zinc-500">{selected.slug}</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6">
              <MarkdownViewer content={selected.content} isDark={isDark} />
            </div>

            {selected.tags && (
              <div className="mt-6">
                <p className="text-xs font-medium text-zinc-500">Tags</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {(JSON.parse(selected.tags) as string[]).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ArtifactActions artifactId={selected.id} isDark={isDark} />

            <div className="mt-6 flex items-center gap-4 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
              <span>Creado: {new Date(selected.createdAt).toLocaleDateString("es-ES")}</span>
              <span>Actualizado: {new Date(selected.updatedAt).toLocaleDateString("es-ES")}</span>
              {selected.filePath && <span>Archivo: {selected.filePath}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
