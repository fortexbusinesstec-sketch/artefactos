import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)]">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 lg:block">
        <nav className="sticky top-16 space-y-1 p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Documentación
          </h2>
          <Link href="#schema" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">
            Schema
          </Link>
          <Link href="#artifacts" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">
            Tabla Artifacts
          </Link>
          <Link href="#action-items" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">
            Tabla Action Items
          </Link>
          <Link href="#indices" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">
            Indices
          </Link>
          <Link href="#setup" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">
            Setup
          </Link>
          <Link href="#api" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800">
            API
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">Documentación</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Referencia completa del esquema y configuración de la base de datos Turso.
          </p>

          <section id="schema" className="mt-12">
            <h2 className="text-2xl font-semibold">Schema</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              La base de datos contiene dos tablas principales: <code>artifacts</code> y <code>action_items</code>, conectadas por una relación foreign key con cascade delete.
            </p>
          </section>

          <section id="artifacts" className="mt-12">
            <h2 className="text-2xl font-semibold">Tabla artifacts</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Tabla principal donde vive todo el conocimiento: entrevistas, pitches, decisiones, research, etc.
            </p>

            <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">Columna</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Constraints</th>
                    <th className="px-4 py-3 font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">id</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">PRIMARY KEY</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Ej: &apos;ent_001&apos;, &apos;pitch_003&apos;</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">title</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">NOT NULL</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Título del artefacto</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">slug</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">UNIQUE, NOT NULL</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Ej: &apos;entrevista-juan-2026-07-14&apos;</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">type</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">NOT NULL, CHECK</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Valores: interview, market_research, pitch, meeting, decision, module, weekly_report, feedback, risk_matrix, competition, business_model</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">content</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">NOT NULL</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Todo el Markdown (títulos, listas, negritas)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">metadata</td>
                    <td className="px-4 py-3">JSON</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Ej: {'{'}&quot;tam&quot;: 5000000, &quot;version&quot;: 3{'}'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">tags</td>
                    <td className="px-4 py-3">JSON</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Ej: [&quot;validacion&quot;, &quot;cliente-potencial&quot;]</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">file_path</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Ruta en repositorio, ej: &apos;artefactos/entrevista-juan.md&apos;</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">created_at</td>
                    <td className="px-4 py-3">DATETIME</td>
                    <td className="px-4 py-3">DEFAULT CURRENT_TIMESTAMP</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Fecha de creación</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">updated_at</td>
                    <td className="px-4 py-3">DATETIME</td>
                    <td className="px-4 py-3">DEFAULT CURRENT_TIMESTAMP</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Fecha de última actualización</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-sm font-semibold">Tipos de artefacto válidos</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {["interview", "market_research", "pitch", "meeting", "decision", "module", "weekly_report", "feedback", "risk_matrix", "competition", "business_model"].map((t) => (
                  <span key={t} className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium dark:border-zinc-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section id="action-items" className="mt-12">
            <h2 className="text-2xl font-semibold">Tabla action_items</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Acciones y tareas extraídas directamente de los artefactos.
            </p>

            <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                  <tr>
                    <th className="px-4 py-3 font-medium">Columna</th>
                    <th className="px-4 py-3 font-medium">Tipo</th>
                    <th className="px-4 py-3 font-medium">Constraints</th>
                    <th className="px-4 py-3 font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">id</td>
                    <td className="px-4 py-3">INTEGER</td>
                    <td className="px-4 py-3">PRIMARY KEY, AUTOINCREMENT</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">ID autoincremental</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">artifact_id</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">NOT NULL, FK → artifacts.id</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Referencia al artefacto padre</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">description</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">NOT NULL</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Descripción de la tarea</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">status</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3">CHECK, DEFAULT &apos;pending&apos;</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Valores: pending, in_progress, done</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">due_date</td>
                    <td className="px-4 py-3">DATETIME</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Fecha límite (opcional)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">assigned_to</td>
                    <td className="px-4 py-3">TEXT</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Nombre del responsable</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">created_at</td>
                    <td className="px-4 py-3">DATETIME</td>
                    <td className="px-4 py-3">DEFAULT CURRENT_TIMESTAMP</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Fecha de creación</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">updated_at</td>
                    <td className="px-4 py-3">DATETIME</td>
                    <td className="px-4 py-3">DEFAULT CURRENT_TIMESTAMP</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">Fecha de última actualización</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="indices" className="mt-12">
            <h2 className="text-2xl font-semibold">Indices</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Optimizados para consultas ultrarrápidas en móvil.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="mt-0.5 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">idx</span>
                <div>
                  <code className="text-sm font-mono">idx_artifacts_type</code>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Filtra por tipo de artefacto</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="mt-0.5 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">idx</span>
                <div>
                  <code className="text-sm font-mono">idx_artifacts_slug</code>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Búsqueda por slug (URL-friendly)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="mt-0.5 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">idx</span>
                <div>
                  <code className="text-sm font-mono">idx_artifacts_updated</code>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Ordena por fecha de actualización (DESC)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="mt-0.5 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">idx</span>
                <div>
                  <code className="text-sm font-mono">idx_actions_status</code>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Filtra tareas por estado</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <span className="mt-0.5 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">idx</span>
                <div>
                  <code className="text-sm font-mono">idx_actions_artifact</code>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Busca tareas por artefacto padre</p>
                </div>
              </div>
            </div>
          </section>

          <section id="setup" className="mt-12">
            <h2 className="text-2xl font-semibold">Setup</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">1. Variables de entorno</h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"><code>{`DATABASE_URL=libsql://incubadora-fortex.aws-us-east-1.turso.io
DATABASE_AUTH_TOKEN=tu_token_aqui`}</code></pre>
              </div>

              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">2. Push del esquema a Turso</h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"><code>npx drizzle-kit push</code></pre>
              </div>

              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">3. Drizzle Studio (visualizar datos)</h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"><code>npx drizzle-kit studio</code></pre>
              </div>
            </div>
          </section>

          <section id="api" className="mt-12">
            <h2 className="text-2xl font-semibold">API de referencia</h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Ejemplos de uso con Drizzle ORM en tu aplicación Next.js.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">Insertar un artefacto</h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"><code>{`import { db } from "@/db";
import { artifacts } from "@/db/schema";

await db.insert(artifacts).values({
  id: "ent_001",
  title: "Entrevista con Juan",
  slug: "entrevista-juan-2026-07-14",
  type: "interview",
  content: "# Entrevista\\n\\n- Dolor principal: ...",
  tags: JSON.stringify(["validacion"]),
});`}</code></pre>
              </div>

              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">Consultar artefactos por tipo</h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"><code>{`import { db } from "@/db";
import { artifacts } from "@/db/schema";
import { eq } from "drizzle-orm";

const interviews = await db
  .select()
  .from(artifacts)
  .where(eq(artifacts.type, "interview"));`}</code></pre>
              </div>

              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-semibold">Insertar acción vinculada a un artefacto</h3>
                <pre className="mt-2 overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 dark:bg-zinc-950"><code>{`import { db } from "@/db";
import { actionItems } from "@/db/schema";

await db.insert(actionItems).values({
  artifactId: "ent_001",
  description: "Segunda llamada con Juan para validar",
  status: "pending",
  assignedTo: "Fabrizio",
});`}</code></pre>
              </div>
            </div>
          </section>

          <div className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Última actualización: {new Date().toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
