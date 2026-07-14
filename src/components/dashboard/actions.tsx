"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useCallback, useEffect } from "react";

interface ActionItem {
  id: number;
  artifactId: string;
  description: string;
  status: string | null;
  dueDate: string | null;
  assignedTo: string | null;
  createdAt: string;
}

const statusDot: Record<string, string> = {
  pending: "bg-amber-500",
  in_progress: "bg-blue-500",
  done: "bg-emerald-500",
};

interface ArtifactActionsProps {
  artifactId: string;
  isDark?: boolean;
}

export function ArtifactActions({ artifactId, isDark }: ArtifactActionsProps) {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);

  const loadActions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/actions?artifactId=${artifactId}`);
      const data = await res.json();
      setActions(Array.isArray(data) ? data : data.data || []);
    } catch {
      setActions([]);
    } finally {
      setLoading(false);
    }
  }, [artifactId]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/actions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadActions();
  };

  const createAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    setSaving(true);
    try {
      await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifactId,
          description: newDescription.trim(),
          assignedTo: newAssignedTo.trim() || null,
        }),
      });
      setNewDescription("");
      setNewAssignedTo("");
      setShowForm(false);
      loadActions();
    } finally {
      setSaving(false);
    }
  };

  const completed = actions.filter((a) => a.status === "done").length;
  const total = actions.length;

  return (
    <div className={`mt-8 rounded-xl border p-4 ${
      isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">Acciones</h3>
          {total > 0 && (
            <span className="text-xs text-zinc-500">
              {completed}/{total} completadas
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={createAction} className="mt-4 space-y-3">
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción de la acción..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <input
            type="text"
            value={newAssignedTo}
            onChange={(e) => setNewAssignedTo(e.target.value)}
            placeholder="Responsible (opcional)"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving || !newDescription.trim()}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
            >
              {saving ? "Guardando..." : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="mt-4 flex justify-center py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
        </div>
      ) : actions.length === 0 ? (
        <p className="mt-4 text-center text-sm text-zinc-400 py-4">
          Sin acciones asociadas
        </p>
      ) : (
        <div className="mt-4 space-y-2">
          {actions.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-lg bg-white p-3 dark:bg-zinc-800/50"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[a.status || "pending"]}`} />
              <span className={`min-w-0 flex-1 text-sm ${
                a.status === "done" ? "text-zinc-400 line-through" : ""
              }`}>
                {a.description}
              </span>
              {a.assignedTo && (
                <span className="shrink-0 text-xs text-zinc-500">
                  → {a.assignedTo}
                </span>
              )}
              <div className="flex shrink-0 gap-1">
                {a.status !== "in_progress" && (
                  <button
                    onClick={() => updateStatus(a.id, "in_progress")}
                    className="rounded p-1 text-zinc-400 hover:text-blue-600"
                    title="En progreso"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </button>
                )}
                {a.status !== "done" && (
                  <button
                    onClick={() => updateStatus(a.id, "done")}
                    className="rounded p-1 text-zinc-400 hover:text-emerald-600"
                    title="Completar"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
