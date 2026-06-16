import { NextResponse } from "next/server";
import {
  fetchOfficialExtracts,
  OFFICIAL_EXTRACTS_URL,
} from "@/lib/results/fetchOfficialExtracts";
import { normalizeDraws } from "@/lib/results/normalizeDraws";
import { parseOfficialExtracts } from "@/lib/results/parseOfficialExtracts";
import { getArgentinaToday } from "@/lib/results/time";
import { DRAW_DEFINITIONS, buildPendingDraws } from "@/lib/results/drawDefinitions";
import type { OfficialDraw } from "@/lib/results/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseScheduledMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function findLatestPublishedDraw(draws: OfficialDraw[]) {
  const orderByKey = new Map(
    DRAW_DEFINITIONS.map((definition, index) => [definition.key, index]),
  );

  return (
    draws
      .filter((draw) => draw.status === "published")
      .sort((left, right) => {
        const timeDiff =
          parseScheduledMinutes(right.scheduledTime) -
          parseScheduledMinutes(left.scheduledTime);

        if (timeDiff !== 0) {
          return timeDiff;
        }

        return (orderByKey.get(right.key) ?? 0) - (orderByKey.get(left.key) ?? 0);
      })[0] ?? null
  );
}

function buildDebug(draws: OfficialDraw[]) {
  return {
    draws: draws.map((draw) => ({
      key: draw.key,
      resultDate: draw.resultDate,
      prizeCount: draw.prizeCount,
      status: draw.status,
    })),
  };
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const today = getArgentinaToday();

  try {
    const html = await fetchOfficialExtracts();
    const parsedExtracts = parseOfficialExtracts(html);
    const draws = normalizeDraws(parsedExtracts.draws, today);
    const latestPublishedDraw = findLatestPublishedDraw(draws);

    return NextResponse.json(
      {
        source: "IPLyC Misiones",
        sourceUrl: OFFICIAL_EXTRACTS_URL,
        sourceUpdatedAt: parsedExtracts.sourceUpdatedAt,
        fetchedAt,
        today,
        draws,
        latestPublishedDraw,
        debug: buildDebug(draws),
      },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo leer la fuente oficial.";

    return NextResponse.json(
      {
        source: "IPLyC Misiones",
        sourceUrl: OFFICIAL_EXTRACTS_URL,
        fetchedAt,
        today,
        draws: buildPendingDraws(),
        latestPublishedDraw: null,
        debug: buildDebug(buildPendingDraws()),
        error: {
          code: "OFFICIAL_SOURCE_UNAVAILABLE",
          message,
        },
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
