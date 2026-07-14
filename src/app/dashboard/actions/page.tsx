"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useRef, useCallback } from "react";

interface ActionItem {
  id: number;
  artifactId: string;
  description: string;
  status: string | null;
  dueDate: string | null;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  done: "Completado",
};

const statusDot: Record<string, string> = {
  pending: "bg-amber-500",
  in_progress: "bg-blue-500",
  done: "bg-emerald-500",
};

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const abortRef = useRef<AbortController | null>(null);

  const loadActions = useCallback((status: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const url = status === "all" ? "/api/actions" : `/api/actions?status=${status}`;
    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setActions(d.data))
      .catch((err) => {
        if (err.name !== "AbortError") setActions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadActions(filter);
  }, [filter, loadActions]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/actions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadActions(filter);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Acciones</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {actions.length} acción{actions.length !== 1 ? "es" : ""}
        </p>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "in_progress", "done"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === s
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {s === "all" ? "Todas" : statusLabels[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
        </div>
      ) : actions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500">No hay acciones para este filtro</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${statusDot[a.status || "pending"]}`} />
                      {statusLabels[a.status || "pending"]}
                    </span>
                    {a.assignedTo && <span>→ {a.assignedTo}</span>}
                    {a.dueDate && (
                      <span>
                        Vence: {new Date(a.dueDate).toLocaleDateString("es-ES")}
                      </span>
                    )}
                    <span className="font-mono text-zinc-400">#{a.artifactId}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  {a.status !== "in_progress" && (
                    <button
                      onClick={() => updateStatus(a.id, "in_progress")}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                      title="Marcar en progreso"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                    </button>
                  )}
                  {a.status !== "done" && (
                    <button
                      onClick={() => updateStatus(a.id, "done")}
                      className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"
                      title="Marcar completado"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
