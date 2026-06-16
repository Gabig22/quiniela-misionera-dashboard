import { DRAW_DEFINITIONS, buildPendingDraws } from "@/lib/results/drawDefinitions";
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

export function normalizeDraws(
  parsedDraws: ParsedOfficialDraw[],
  today: string,
): OfficialDraw[] {
  if (!today) {
    return buildPendingDraws();
  }

  return DRAW_DEFINITIONS.map((definition) => {
    const officialTitle = normalizeTitle(definition.officialTitle);
    const parsedDraw = parsedDraws.find(
      (draw) =>
        normalizeTitle(draw.officialTitle) === officialTitle &&
        draw.resultDate === today,
    );

    const isPublished = Boolean(parsedDraw && isCompletePrizeList(parsedDraw));

    return {
      key: definition.key,
      title: definition.title,
      scheduledTime: definition.scheduledTime,
      resultDate: parsedDraw?.resultDate ?? null,
      resultTime: parsedDraw?.resultTime ?? null,
      drawNumber: parsedDraw?.drawNumber ?? null,
      status: isPublished ? "published" : "pending",
      prizes: isPublished ? parsedDraw!.prizes : [],
      accent: definition.accent,
    };
  });
}
