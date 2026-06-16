import type { DrawKey, OfficialDraw } from "@/lib/results/types";

export type DrawDefinition = {
  key: DrawKey;
  officialTitle: string;
  title: string;
  scheduledTime: string;
  accent: string;
};

export const DRAW_DEFINITIONS: DrawDefinition[] = [
  {
    key: "previa",
    officialTitle: "QUINIELA MISIONERA LA PREVIA",
    title: "Previa",
    scheduledTime: "10:30",
    accent: "#8b5cf6",
  },
  {
    key: "primera",
    officialTitle: "QUINIELA MISIONERA PRIMERA MATUTINA",
    title: "Primera Matutina",
    scheduledTime: "12:15",
    accent: "#f59e0b",
  },
  {
    key: "matutina",
    officialTitle: "QUINIELA MISIONERA MATUTINA",
    title: "Matutina",
    scheduledTime: "15:00",
    accent: "#38bdf8",
  },
  {
    key: "matutinaPlus",
    officialTitle: "QUINIELA MISIONERA MATUTINA PLUS",
    title: "Matutina Plus",
    scheduledTime: "15:00",
    accent: "#0ea5e9",
  },
  {
    key: "vespertina",
    officialTitle: "QUINIELA MISIONERA VESPERTINA",
    title: "Vespertina",
    scheduledTime: "18:00",
    accent: "#22c55e",
  },
  {
    key: "nocturna",
    officialTitle: "QUINIELA MISIONERA NOCTURNA",
    title: "Nocturna",
    scheduledTime: "21:30",
    accent: "#ef4444",
  },
  {
    key: "nocturnaPlus",
    officialTitle: "QUINIELA MISIONERA NOCTURNA PLUS",
    title: "Nocturna Plus",
    scheduledTime: "21:30",
    accent: "#e11d48",
  },
];

export function buildPendingDraws(): OfficialDraw[] {
  return DRAW_DEFINITIONS.map((definition) => ({
    key: definition.key,
    title: definition.title,
    scheduledTime: definition.scheduledTime,
    resultDate: null,
    resultTime: null,
    drawNumber: null,
    status: "pending",
    prizeCount: 0,
    prizes: [],
    accent: definition.accent,
  }));
}
