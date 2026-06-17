import { DRAW_DEFINITIONS, buildPendingDraws } from "@/lib/results/drawDefinitions";
import { normalizeOfficialDate, normalizeOfficialTime } from "@/lib/results/time";
import type {
  OfficialDraw,
  ParsedOfficialDraw,
} from "@/lib/results/types";

function normalizeTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function isCompletePrizeList(draw: ParsedOfficialDraw) {
  return (
    draw.prizes.length === 20 &&
    draw.prizes.every(
      (prize, index) =>
        prize.position === index + 1 && /^\d{4}$/.test(prize.number),
    )
  );
}

function parseDateValue(date: string) {
  const normalizedDate = normalizeOfficialDate(date);
  const match = normalizedDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return 0;
  }

  const [, day, month, year] = match;

  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

function parseTimeValue(time: string) {
  const normalizedTime = normalizeOfficialTime(time);
  const match = normalizedTime.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return 0;
  }

  const [, hours, minutes] = match;

  return Number(hours) * 60 + Number(minutes);
}

function findRelevantDraw(candidates: ParsedOfficialDraw[], today: string) {
  const todayDraw = candidates.find(
    (draw) => normalizeOfficialDate(draw.resultDate) === today,
  );

  if (todayDraw) {
    return todayDraw;
  }

  return [...candidates].sort((left, right) => {
    const dateDiff =
      parseDateValue(right.resultDate) - parseDateValue(left.resultDate);

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return parseTimeValue(right.resultTime) - parseTimeValue(left.resultTime);
  })[0];
}

export function normalizeDraws(
  parsedDraws: ParsedOfficialDraw[],
  today: string,
): OfficialDraw[] {
  const normalizedToday = normalizeOfficialDate(today);

  if (!normalizedToday) {
    return buildPendingDraws();
  }

  return DRAW_DEFINITIONS.map((definition) => {
    const officialTitle = normalizeTitle(definition.officialTitle);
    const candidates = parsedDraws.filter(
      (draw) => normalizeTitle(draw.officialTitle) === officialTitle,
    );
    const parsedDraw = findRelevantDraw(candidates, normalizedToday);
    const resultDate = parsedDraw
      ? normalizeOfficialDate(parsedDraw.resultDate)
      : null;
    const resultTime = parsedDraw
      ? normalizeOfficialTime(parsedDraw.resultTime)
      : null;
    const prizeCount = parsedDraw?.prizes.length ?? 0;

    const isPublished = Boolean(
      parsedDraw &&
        resultDate === normalizedToday &&
        isCompletePrizeList(parsedDraw),
    );
    const hasDisplayablePrizes = Boolean(
      parsedDraw && isCompletePrizeList(parsedDraw),
    );

    return {
      key: definition.key,
      title: definition.title,
      scheduledTime: definition.scheduledTime,
      resultDate,
      resultTime,
      drawNumber: parsedDraw?.drawNumber ?? null,
      status: isPublished ? "published" : "pending",
      prizeCount,
      prizes: hasDisplayablePrizes ? parsedDraw!.prizes : [],
      accent: definition.accent,
    };
  });
}
