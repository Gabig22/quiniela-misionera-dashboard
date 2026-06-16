import { NextResponse } from "next/server";
import {
  fetchOfficialExtracts,
  OFFICIAL_EXTRACTS_URL,
} from "@/lib/results/fetchOfficialExtracts";
import { normalizeDraws } from "@/lib/results/normalizeDraws";
import { parseOfficialExtracts } from "@/lib/results/parseOfficialExtracts";
import { getArgentinaToday } from "@/lib/results/time";
import { buildPendingDraws } from "@/lib/results/drawDefinitions";

export const revalidate = 60;

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const today = getArgentinaToday();

  try {
    const html = await fetchOfficialExtracts();
    const parsedExtracts = parseOfficialExtracts(html);
    const draws = normalizeDraws(parsedExtracts.draws, today);
    const latestPublishedDraw =
      [...draws].reverse().find((draw) => draw.status === "published") ?? null;

    return NextResponse.json(
      {
        source: "IPLyC Misiones",
        sourceUrl: OFFICIAL_EXTRACTS_URL,
        sourceUpdatedAt: parsedExtracts.sourceUpdatedAt,
        fetchedAt,
        today,
        draws,
        latestPublishedDraw,
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
