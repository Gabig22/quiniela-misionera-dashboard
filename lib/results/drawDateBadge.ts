import { getArgentinaToday, normalizeOfficialDate } from "@/lib/results/time";
import type { OfficialDraw } from "@/lib/results/types";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export type DrawDateBadge = "Hoy" | "Ayer" | "Pendiente";

export function getDrawDateBadge(
  draw: Pick<OfficialDraw, "resultDate" | "status" | "prizes">,
  now = new Date(),
): DrawDateBadge {
  const resultDate = normalizeOfficialDate(draw.resultDate);

  if (!resultDate) {
    return "Pendiente";
  }

  const today = getArgentinaToday(now);
  const yesterday = getArgentinaToday(new Date(now.getTime() - ONE_DAY_IN_MS));

  if (draw.status === "published" && resultDate === today) {
    return "Hoy";
  }

  if (draw.prizes.length > 0 && resultDate === yesterday) {
    return "Ayer";
  }

  return "Pendiente";
}
