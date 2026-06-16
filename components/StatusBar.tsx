type StatusBarProps = {
  publishedCount: number;
  totalCount: number;
  fetchedAtLabel: string | null;
  sourceUpdatedAt: string | null;
  connectionError: string | null;
};

export default function StatusBar({
  publishedCount,
  totalCount,
  fetchedAtLabel,
  sourceUpdatedAt,
  connectionError,
}: StatusBarProps) {
  return (
    <footer className="flex items-center justify-between gap-6 rounded-md border border-white/10 bg-[#081827]/82 px-5 py-3 text-sm font-semibold text-slate-300 shadow-panel">
      <div className="min-w-0">
        <span>Fuente oficial: IPLyC Misiones &middot; loteriademisiones.com.ar</span>
        <span className="ml-4 text-slate-500">
          Los resultados oficiales son los publicados por IPLyC.
        </span>
        {sourceUpdatedAt ? (
          <span className="ml-4 text-slate-400">
            Fuente actualizada: {sourceUpdatedAt}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-5">
        <span className="text-slate-400">
          {publishedCount}/{totalCount} sorteos publicados
        </span>
        <span
          className={`flex items-center gap-2 ${
            connectionError ? "text-amber-200" : "text-emerald-200"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connectionError ? "bg-amber-300" : "bg-emerald-300"
            }`}
          />
          {connectionError
            ? `Sin conexion con fuente oficial${
                fetchedAtLabel ? ` - ultimo dato ${fetchedAtLabel}` : ""
              }`
            : `Actualizado recien${fetchedAtLabel ? ` - ${fetchedAtLabel}` : ""}`}
        </span>
      </div>
    </footer>
  );
}
