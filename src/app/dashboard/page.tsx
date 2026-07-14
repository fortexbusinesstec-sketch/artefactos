"use client";

import { useEffect, useState } from "react";
import { getTypeLabel } from "@/lib/artifact-types";

interface Stats {
  totalArtifacts: number;
  totalActions: number;
  pendingActions: number;
  byType: { type: string; count: number }[];
  byStatus: { status: string; count: number }[];
  recentArtifacts: {
    id: string;
    title: string;
    type: string;
    slug: string;
    createdAt: string;
  }[];
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  done: "Completado",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="py-20 text-center text-zinc-500">
        No se pudieron cargar los datos. Verifica la conexión a Turso.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resumen</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Vista general de tu base de conocimiento
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Artefactos totales
          </p>
          <p className="mt-2 text-3xl font-bold">{stats.totalArtifacts}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Acciones totales
          </p>
          <p className="mt-2 text-3xl font-bold">{stats.totalActions}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Pendientes
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {stats.pendingActions}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold">Por tipo de artefacto</h2>
          <div className="mt-4 space-y-3">
            {stats.byType.length === 0 && (
              <p className="text-sm text-zinc-400">Sin datos aún</p>
            )}
            {stats.byType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <span className="text-sm">{getTypeLabel(item.type)}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-900 dark:bg-white"
                      style={{
                        width: `${stats.totalArtifacts > 0 ? (item.count / stats.totalArtifacts) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold">Estado de acciones</h2>
          <div className="mt-4 space-y-3">
            {stats.byStatus.length === 0 && (
              <p className="text-sm text-zinc-400">Sin datos aún</p>
            )}
            {stats.byStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      item.status === "done"
                        ? "bg-emerald-500"
                        : item.status === "in_progress"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                    }`}
                  />
                  {statusLabels[item.status || "pending"] || item.status}
                </span>
                <span className="text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold">Artefactos recientes</h2>
        <div className="mt-4">
          {stats.recentArtifacts.length === 0 && (
            <p className="text-sm text-zinc-400">No hay artefactos aún</p>
          )}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {stats.recentArtifacts.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {getTypeLabel(a.type)}
                  </p>
                </div>
                <span className="ml-4 shrink-0 text-xs text-zinc-400">
                  {new Date(a.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
