export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date().getFullYear()} Operate. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Hecho por Fortex Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
