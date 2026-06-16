import type { OfficialDraw } from "@/lib/results/types";

type DrawCardProps = {
  draw: OfficialDraw;
};

export default function DrawCard({ draw }: DrawCardProps) {
  const isPublished = draw.status === "published";
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-white">{draw.title}</h2>
          <p className="mt-1 font-mono text-sm font-bold text-slate-300">
            {draw.resultTime ?? draw.scheduledTime} hs
          </p>
        </div>
        <span
          className={`rounded-md border px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em] ${
            isPublished
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-[#f6d365]/35 bg-[#f6d365]/10 text-[#f6d365]"
          }`}
        >
          {isPublished ? "Publicado" : "Pendiente"}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        <span>{draw.resultDate ?? "Sin fecha"}</span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span>Sorteo {draw.drawNumber ?? "----"}</span>
      </div>

      <div className="mt-3 rounded-md border border-white/10 bg-[#061322]/48 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          A la cabeza
        </p>
        <p
          className="mt-1 font-mono text-6xl font-black leading-none tracking-normal"
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
