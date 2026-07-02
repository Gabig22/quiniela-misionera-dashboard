import {
  fetchOfficialExtracts,
  OFFICIAL_EXTRACTS_URL,
} from "@/lib/results/fetchOfficialExtracts";
import { DRAW_DEFINITIONS, buildPendingDraws } from "@/lib/results/drawDefinitions";
import { normalizeDraws } from "@/lib/results/normalizeDraws";
import { normalizeOtherLotteries } from "@/lib/results/normalizeOtherLotteries";
import { parseOfficialExtracts } from "@/lib/results/parseOfficialExtracts";
import { getArgentinaToday } from "@/lib/results/time";
import type {
  OfficialDraw,
  ResultsApiError,
  ResultsApiResponse,
  ResultsApiSuccess,
} from "@/lib/results/types";

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

function buildDebug(draws: OfficialDraw[], otherLotteriesCount = 0) {
  return {
    publishedCount: draws.filter((draw) => draw.status === "published").length,
    otherLotteriesCount,
    draws: draws.map((draw) => ({
      key: draw.key,
      resultDate: draw.resultDate,
      resultTime: draw.resultTime,
      drawNumber: draw.drawNumber,
      prizeCount: draw.prizeCount,
      prizesLength: draw.prizes.length,
      firstPrize: draw.prizes[0]?.number ?? null,
      status: draw.status,
    })),
  };
}

export async function getResultsPayload(): Promise<{
  payload: ResultsApiResponse;
  status: 200 | 503;
}> {
  const fetchedAt = new Date().toISOString();
  const today = process.env.IPLYC_DEBUG_TODAY ?? getArgentinaToday();

  try {
    const officialExtracts = await fetchOfficialExtracts();
    const parsedExtracts = parseOfficialExtracts(officialExtracts.html);
    const draws = normalizeDraws(parsedExtracts.draws, today);
    const otherLotteries = normalizeOtherLotteries(parsedExtracts.draws, today);
    const latestPublishedDraw = findLatestPublishedDraw(draws);
    const payload: ResultsApiSuccess = {
      source: "IPLyC Misiones",
      sourceUrl: OFFICIAL_EXTRACTS_URL,
      sourceUpdatedAt: parsedExtracts.sourceUpdatedAt,
      fetchedAt,
      today,
      draws,
      otherLotteries,
      latestPublishedDraw,
      debug: {
        ...buildDebug(draws, otherLotteries.length),
        fetchMode: officialExtracts.fetchMode,
        directStatus: officialExtracts.directStatus,
        parsedDrawsCount: parsedExtracts.draws.length,
      },
    };

    return {
      payload,
      status: 200,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo leer la fuente oficial.";
    const pendingDraws = buildPendingDraws();
    const payload: ResultsApiError = {
      source: "IPLyC Misiones",
      sourceUrl: OFFICIAL_EXTRACTS_URL,
      fetchedAt,
      today,
      draws: pendingDraws,
      otherLotteries: [],
      latestPublishedDraw: null,
      debug: buildDebug(pendingDraws),
      error: {
        code: "OFFICIAL_SOURCE_UNAVAILABLE",
        message,
      },
    };

    return {
      payload,
      status: 503,
    };
  }
}
