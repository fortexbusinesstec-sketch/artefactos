export const ARTIFACT_TYPES = [
  { value: "interview", label: "Entrevista", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "meeting", label: "Reunión", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  { value: "decision", label: "Decisión", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  { value: "market_research", label: "Market Research", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "pitch", label: "Pitch", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
  { value: "business_model", label: "Modelo de Negocio", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { value: "product_spec", label: "Especificación", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { value: "weekly_report", label: "Reporte Semanal", color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  { value: "feedback", label: "Feedback", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "risk_matrix", label: "Riesgos", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { value: "validation", label: "Validación", color: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400" },
  { value: "resource", label: "Recurso", color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  { value: "task_list", label: "Lista de Tareas", color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400" },
  { value: "note", label: "Nota", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
] as const;

export type ArtifactTypeValue = (typeof ARTIFACT_TYPES)[number]["value"];

export function getTypeLabel(value: string): string {
  return ARTIFACT_TYPES.find((t) => t.value === value)?.label || value;
}

export function getTypeColor(value: string): string {
  return ARTIFACT_TYPES.find((t) => t.value === value)?.color || "bg-zinc-100 text-zinc-700";
}

export const ALL_TYPE_VALUES = ["all", ...ARTIFACT_TYPES.map((t) => t.value)] as const;
