"use client";

import { useEffect, useMemo, useState } from "react";
import { getDrawDateBadge } from "@/lib/results/drawDateBadge";
import type { OtherLotteryResult } from "@/lib/results/types";

type OtherLotteryCardProps = {
  lotteries: OtherLotteryResult[];
};

export default function OtherLotteryCard({ lotteries }: OtherLotteryCardProps) {
  const visibleLotteries = useMemo(
    () => lotteries.filter((lottery) => lottery.prizes.length > 0),
    [lotteries],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationResetKey, setRotationResetKey] = useState(0);
  const activeLottery =
    visibleLotteries.length > 0
      ? visibleLotteries[activeIndex % visibleLotteries.length]
      : null;

  useEffect(() => {
    setActiveIndex(0);
  }, [visibleLotteries.length]);

  useEffect(() => {
    if (visibleLotteries.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % visibleLotteries.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [rotationResetKey, visibleLotteries.length]);

  if (!activeLottery) {
    return null;
  }

  const dateBadge = getDrawDateBadge(activeLottery);
  const isTodayBadge = dateBadge === "Hoy";
  const headNumber =
    activeLottery.prizes.find((prize) => prize.position === 1)?.number ?? "----";
  const prizeMap = new Map(
    activeLottery.prizes.map((prize) => [prize.position, prize.number]),
  );
  const secondaryPrizes = Array.from({ length: 19 }, (_, index) => {
    const position = index + 2;

    return {
      position,
      number: prizeMap.get(position),
    };
  }).filter((prize): prize is { position: number; number: string } =>
    Boolean(prize.number),
  );
  const badgeClass = isTodayBadge
    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
    : dateBadge === "Ayer"
      ? "border-[#f6d365]/35 bg-[#f6d365]/10 text-[#f6d365]"
      : "border-slate-500/30 bg-slate-500/10 text-slate-300";
  const drawTitle =
    activeLottery.title === "La Previa" ? "Previa" : activeLottery.title;
  const activeIndicatorIndex = activeIndex % visibleLotteries.length;

  function selectLottery(index: number) {
    setActiveIndex(index);
    setRotationResetKey((key) => key + 1);
  }

  return (
    <article
      className="relative overflow-hidden rounded-md border-2 border-cyan-300/30 bg-[#102236]/88 p-3 shadow-[0_0_0_1px_rgba(246,211,101,0.12),0_18px_40px_rgba(0,0,0,0.24)]"
      style={{ borderTopColor: activeLottery.accent }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: activeLottery.accent }}
      />
      <div className="flex h-[70px] items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f6d365]">
            Resultados extra
          </p>
          <h2 className="mt-1 truncate text-xl font-black leading-tight text-white">
            {drawTitle}
          </h2>
          <p className="mt-0.5 truncate text-sm font-black uppercase tracking-[0.12em] text-cyan-100/75">
            {activeLottery.jurisdictionTitle}
          </p>
        </div>
        <span
          className={`min-w-[6.5rem] shrink-0 rounded-md border px-2.5 py-1 text-center text-xs font-black tracking-[0.1em] ${badgeClass}`}
        >
          {dateBadge}
        </span>
      </div>

      <div className="mt-2 flex h-5 items-center gap-2 overflow-hidden text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        <span className="shrink-0">
          {activeLottery.resultDate ?? "Sin fecha"}
        </span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span className="shrink-0">
          {activeLottery.resultTime ?? activeLottery.scheduledTime} hs
        </span>
      </div>

      <div className="mt-3 flex h-[106px] flex-col justify-between rounded-md border border-white/10 bg-[#061322]/48 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          A la cabeza
        </p>
        <p
          className="font-mono text-6xl font-black leading-none tracking-normal tabular-nums"
          style={{
            color:
              activeLottery.status === "published"
                ? activeLottery.accent
                : "#94a3b8",
          }}
        >
          {headNumber}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2 overflow-hidden text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        <span className="shrink-0">{activeLottery.jurisdictionTitle}</span>
        <span className="h-1 w-1 rounded-full bg-slate-600" />
        <span className="truncate">Sorteo {activeLottery.drawNumber ?? "----"}</span>
      </div>

      <ol className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {secondaryPrizes.map((prize) => (
          <li
            key={`${activeLottery.key}-${prize.position}`}
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

      <div className="mt-3 flex gap-1.5">
        {visibleLotteries.map((lottery, index) => (
          <button
            key={lottery.key}
            type="button"
            aria-label={`Ver ${lottery.title} - ${lottery.jurisdictionTitle}`}
            aria-pressed={index === activeIndicatorIndex}
            title={`${lottery.title} - ${lottery.jurisdictionTitle}`}
            onClick={() => selectLottery(index)}
            onMouseEnter={() => selectLottery(index)}
            className={`h-1.5 flex-1 cursor-pointer rounded-full transition duration-150 hover:scale-y-125 ${
              index === activeIndicatorIndex
                ? "bg-[#f6d365]"
                : "bg-white/10 hover:bg-white/25"
            }`}
          />
        ))}
      </div>
    </article>
  );
}
