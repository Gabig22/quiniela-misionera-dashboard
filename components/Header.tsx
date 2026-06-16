type HeaderProps = {
  dateLabel: string;
  timeLabel: string;
  nextDrawName: string;
  countdown: string;
};

export default function Header({
  dateLabel,
  timeLabel,
  nextDrawName,
  countdown,
}: HeaderProps) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-6 rounded-lg border border-white/10 bg-[#0b1d31]/78 px-5 py-4 shadow-panel">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-[#f2c94c]/45 bg-[#0f3154] text-3xl font-black tracking-normal text-[#f6d365] shadow-panel">
          Q
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="rounded border border-[#f2c94c]/35 bg-[#f2c94c]/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#f6d365]">
              IPLyC
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
              Misiones
            </span>
          </div>
          <h1 className="mt-1 truncate text-3xl font-black tracking-normal text-white">
            Quiniela Misionera
          </h1>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
            Agencia &middot; Resultados en vivo
          </p>
        </div>
      </div>

      <div className="rounded-md border border-white/10 bg-white/[0.045] px-8 py-3 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#f6d365]">
          {dateLabel}
        </p>
        <div className="mt-1 font-mono text-6xl font-black leading-none text-white">
          {timeLabel}
        </div>
      </div>

      <div className="justify-self-end rounded-md border border-white/12 bg-[#10243b]/86 px-5 py-4 text-right">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
          Pr&oacute;ximo sorteo
        </p>
        <div className="mt-2 flex items-end justify-end gap-4">
          <span className="text-2xl font-extrabold text-white">{nextDrawName}</span>
          <span className="font-mono text-4xl font-black text-[#f6d365]">
            {countdown}
          </span>
        </div>
      </div>
    </header>
  );
}
