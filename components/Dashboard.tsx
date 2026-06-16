"use client";

import { useEffect, useMemo, useState } from "react";
import DrawCard from "@/components/DrawCard";
import Header from "@/components/Header";
import RecentDraw from "@/components/RecentDraw";
import StatusBar from "@/components/StatusBar";
import { buildPendingDraws } from "@/lib/results/drawDefinitions";
import { ARGENTINA_TIME_ZONE } from "@/lib/results/time";
import type {
  OfficialDraw,
  ResultsApiResponse,
  ResultsApiSuccess,
} from "@/lib/results/types";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: ARGENTINA_TIME_ZONE,
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: ARGENTINA_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  hour12: false,
});

function getArgentinaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ARGENTINA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    hour12: false,
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
    hour: Number(parts.find((part) => part.type === "hour")?.value),
    minute: Number(parts.find((part) => part.type === "minute")?.value),
    second: Number(parts.find((part) => part.type === "second")?.value),
  };
}

function getArgentinaOffset(date: Date) {
  const parts = getArgentinaDateParts(date);
  const argentinaAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return argentinaAsUtc - date.getTime();
}

function getArgentinaScheduledDate(time: string, now: Date) {
  const argentinaNow = getArgentinaDateParts(now);
  const [hours, minutes] = time.split(":").map(Number);
  const targetAsUtc = Date.UTC(
    argentinaNow.year,
    argentinaNow.month - 1,
    argentinaNow.day,
    hours,
    minutes,
    0,
  );
  const target = new Date(targetAsUtc - getArgentinaOffset(now));

  if (target.getTime() <= now.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }

  return target;
}

function formatCountdown(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
}

function isSuccessResponse(
  response: ResultsApiResponse,
): response is ResultsApiSuccess {
  return !("error" in response) && "draws" in response;
}

function formatFetchTime(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("es-AR", {
    timeZone: ARGENTINA_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    hour12: false,
  }).format(new Date(value));
}

export default function Dashboard() {
  const [now, setNow] = useState(() => new Date());
  const [draws, setDraws] = useState<OfficialDraw[]>(() => buildPendingDraws());
  const [latestPublishedDraw, setLatestPublishedDraw] =
    useState<OfficialDraw | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [sourceUpdatedAt, setSourceUpdatedAt] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadResults() {
      try {
        const response = await fetch("/api/results", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ResultsApiResponse;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !isSuccessResponse(payload)) {
          setConnectionError(
            "Sin conexion con fuente oficial. Se mantiene la ultima lectura disponible.",
          );
          return;
        }

        setDraws(payload.draws);
        setLatestPublishedDraw(payload.latestPublishedDraw);
        setFetchedAt(payload.fetchedAt);
        setSourceUpdatedAt(payload.sourceUpdatedAt);
        setConnectionError(null);
      } catch {
        if (isMounted) {
          setConnectionError(
            "Sin conexion con fuente oficial. Se mantiene la ultima lectura disponible.",
          );
        }
      }
    }

    void loadResults();
    const poller = window.setInterval(loadResults, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(poller);
    };
  }, []);

  const publishedResults = draws.filter((draw) => draw.status === "published");
  const recentDraw =
    latestPublishedDraw ?? publishedResults[publishedResults.length - 1] ?? draws[0];

  const nextDraw = useMemo(() => {
    return draws
      .map((draw) => ({
        draw,
        target: getArgentinaScheduledDate(draw.scheduledTime, now),
      }))
      .sort((left, right) => left.target.getTime() - right.target.getTime())[0]
      .draw;
  }, [draws, now]);

  const nextDrawDate = useMemo(
    () => getArgentinaScheduledDate(nextDraw.scheduledTime, now),
    [nextDraw.scheduledTime, now],
  );

  return (
    <main className="flex min-h-screen w-full flex-col gap-5 overflow-hidden px-6 py-5">
      <Header
        dateLabel={dateFormatter.format(now)}
        timeLabel={timeFormatter.format(now)}
        nextDrawName={nextDraw.title}
        countdown={formatCountdown(nextDrawDate, now)}
      />

      <section className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="grid min-h-0 grid-cols-4 gap-4">
          {draws.map((draw) => (
            <DrawCard key={draw.key} draw={draw} />
          ))}
        </div>
        <RecentDraw draw={recentDraw} />
      </section>

      <StatusBar
        publishedCount={publishedResults.length}
        totalCount={draws.length}
        fetchedAtLabel={formatFetchTime(fetchedAt)}
        sourceUpdatedAt={sourceUpdatedAt}
        connectionError={connectionError}
      />
    </main>
  );
}
