import type { OfficialDraw } from "@/lib/results/types";

type RecentDrawProps = {
  draw: OfficialDraw;
};

export default function RecentDraw({ draw }: RecentDrawProps) {
  const isPublished = draw.status === "published";
  const headNumber =
    draw.prizes.find((prize) => prize.position === 1)?.number ?? "----";
  const topPrizes = draw.prizes
    .filter((prize) => prize.position >= 2)
    .slice(0, 5);
  const visiblePrizes =
    topPrizes.length > 0
      ? topPrizes
      : Array.from({ length: 5 }, (_, index) => ({
          position: index + 2,
          number: "----",
        }));

  return (
    <aside className="rounded-md border border-white/10 bg-[#0e2238]/88 p-5 shadow-panel">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f6d365]">
        Sorteo m&aacute;s reciente
      </p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">{draw.title}</h2>
          <p className="mt-1 font-mono text-base font-bold text-slate-300">
            {draw.resultTime ?? draw.scheduledTime} hs &middot;{" "}
            {isPublished ? "Publicado" : "Pendiente"}
          </p>
        </div>
        <div
          className="h-4 w-4 rounded-sm"
          style={{ color: draw.accent, backgroundColor: draw.accent }}
        />
      </div>

      <div className="mt-6 rounded-md border border-white/10 bg-[#061322]/52 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          N&uacute;mero ganador
        </p>
        <p
          className="mt-2 font-mono text-8xl font-black leading-none tracking-normal"
          style={{ color: isPublished ? draw.accent : "#94a3b8" }}
        >
          {headNumber}
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {visiblePrizes.map((prize) => (
          <div
            key={`${draw.key}-recent-${prize.position}`}
            className="flex items-center justify-between rounded-sm border border-white/[0.08] bg-white/[0.04] px-3 py-2 font-mono"
          >
            <span className="font-bold text-slate-400">
              {prize.position}&deg; premio
            </span>
            <span className="text-2xl font-black text-white">
              {prize.number}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
