import type { OfficialDraw } from "@/lib/results/types";
import { getDrawDateBadge } from "@/lib/results/drawDateBadge";

type DrawCardProps = {
  draw: OfficialDraw;
};

export default function DrawCard({ draw }: DrawCardProps) {
  const isPublished = draw.status === "published";
  const dateBadge = getDrawDateBadge(draw);
  const isTodayBadge = dateBadge === "Hoy";
  const badgeClass =
    dateBadge === "Hoy"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : dateBadge === "Ayer"
        ? "border-[#f6d365]/35 bg-[#f6d365]/10 text-[#f6d365]"
        : "border-slate-500/30 bg-slate-500/10 text-slate-300";
  const headNumber =
    draw.prizes.find((prize) => prize.position === 1)?.number ?? "----";
  const prizeMap = new Map(
    draw.prizes.map((prize) => [prize.position, prize.number]),
  );
  const secondaryPrizes = Array.from({ length: 19 }, (_, index) => {
    const position = index + 2;

    return {
      position,
      number: prizeMap.get(position) ?? "----",
    };
  });

  return (
    <article
      className="relative overflow-hidden rounded-md border border-white/10 bg-[#102236]/88 p-3 shadow-panel"
      style={{ borderTopColor: draw.accent }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: draw.accent }}
      />
      <div className="flex h-[58px] items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-black leading-tight text-white">
            {draw.title}
          </h2>
          <p className="mt-1 font-mono text-sm font-bold text-slate-300">
            {draw.resultTime ?? draw.scheduledTime} hs
          </p>
        </div>
        <span
          className={`min-w-[6.5rem] shrink-0 rounded-md border px-2.5 py-1 text-center text-xs font-black tracking-[0.1em] ${badgeClass}`}
        >
          {dateBadge}
        </span>
      </div>

      <div className="mt-2 flex h-5 items-center gap-2 overflow-hidden text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        <span className="shrink-0">{draw.resultDate ?? "Sin fecha"}</span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span className="truncate">Sorteo {draw.drawNumber ?? "----"}</span>
      </div>

      <div className="mt-3 flex h-[106px] flex-col justify-between rounded-md border border-white/10 bg-[#061322]/48 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          A la cabeza
        </p>
        <p
          className="font-mono text-6xl font-black leading-none tracking-normal tabular-nums"
          style={{ color: isPublished ? draw.accent : "#94a3b8" }}
        >
          {headNumber}
        </p>
      </div>

      <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {secondaryPrizes.map((prize) => (
          <li
            key={`${draw.key}-${prize.position}`}
            className="flex items-center justify-between border-b border-white/[0.06] py-1 font-mono"
          >
            <span className="font-bold text-slate-500">
              {prize.position.toString().padStart(2, "0")}&deg;
            </span>
            <span className="text-base font-black text-slate-100">
              {prize.number}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
