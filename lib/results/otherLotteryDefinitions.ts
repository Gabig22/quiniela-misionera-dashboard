import type { OtherLotteryJurisdiction } from "@/lib/results/types";

export type OtherLotteryDefinition = {
  key: string;
  jurisdiction: OtherLotteryJurisdiction;
  jurisdictionTitle: string;
  officialTitles: string[];
  title: string;
  scheduledTime: string;
  accent: string;
};

export const OTHER_LOTTERY_DEFINITIONS: OtherLotteryDefinition[] = [
  {
    key: "lotbaPrevia",
    jurisdiction: "lotba",
    jurisdictionTitle: "LotBA",
    officialTitles: ["QUINIELA DE LA CIUDAD | LOTBA LA PREVIA"],
    title: "La Previa",
    scheduledTime: "10:30",
    accent: "#60a5fa",
  },
  {
    key: "lotbaPrimera",
    jurisdiction: "lotba",
    jurisdictionTitle: "LotBA",
    officialTitles: ["QUINIELA DE LA CIUDAD | LOTBA PRIMERA MATUTINA"],
    title: "Primera Matutina",
    scheduledTime: "12:15",
    accent: "#60a5fa",
  },
  {
    key: "lotbaMatutina",
    jurisdiction: "lotba",
    jurisdictionTitle: "LotBA",
    officialTitles: ["QUINIELA DE LA CIUDAD | LOTBA MATUTINA"],
    title: "Matutina",
    scheduledTime: "15:00",
    accent: "#60a5fa",
  },
  {
    key: "lotbaVespertina",
    jurisdiction: "lotba",
    jurisdictionTitle: "LotBA",
    officialTitles: ["QUINIELA DE LA CIUDAD | LOTBA VESPERTINA"],
    title: "Vespertina",
    scheduledTime: "18:00",
    accent: "#60a5fa",
  },
  {
    key: "lotbaNocturna",
    jurisdiction: "lotba",
    jurisdictionTitle: "LotBA",
    officialTitles: ["QUINIELA DE LA CIUDAD | LOTBA NOCTURNA"],
    title: "Nocturna",
    scheduledTime: "21:30",
    accent: "#60a5fa",
  },
  {
    key: "buenosAiresPrevia",
    jurisdiction: "buenosAires",
    jurisdictionTitle: "Buenos Aires",
    officialTitles: ["QUINIELA PROVINCIA BS AS LA PREVIA"],
    title: "La Previa",
    scheduledTime: "10:30",
    accent: "#f97316",
  },
  {
    key: "buenosAiresPrimera",
    jurisdiction: "buenosAires",
    jurisdictionTitle: "Buenos Aires",
    officialTitles: ["QUINIELA PROVINCIA BS AS PRIMERA MATUTINA"],
    title: "Primera Matutina",
    scheduledTime: "12:15",
    accent: "#f97316",
  },
  {
    key: "buenosAiresMatutina",
    jurisdiction: "buenosAires",
    jurisdictionTitle: "Buenos Aires",
    officialTitles: [
      "QUINIELA PROVINCIA BSAS MATUTINA",
      "QUINIELA PROVINCIA BS AS MATUTINA",
    ],
    title: "Matutina",
    scheduledTime: "15:00",
    accent: "#f97316",
  },
  {
    key: "buenosAiresVespertina",
    jurisdiction: "buenosAires",
    jurisdictionTitle: "Buenos Aires",
    officialTitles: ["QUINIELA PROVINCIA BS AS VESPERTINA"],
    title: "Vespertina",
    scheduledTime: "18:00",
    accent: "#f97316",
  },
  {
    key: "buenosAiresNocturna",
    jurisdiction: "buenosAires",
    jurisdictionTitle: "Buenos Aires",
    officialTitles: ["QUINIELA PROVINCIA BS AS NOCTURNA"],
    title: "Nocturna",
    scheduledTime: "21:30",
    accent: "#f97316",
  },
  {
    key: "santaFePrevia",
    jurisdiction: "santaFe",
    jurisdictionTitle: "Santa Fe",
    officialTitles: ["QUINIELA DE SANTA FE LA PREVIA"],
    title: "La Previa",
    scheduledTime: "10:30",
    accent: "#22c55e",
  },
  {
    key: "santaFePrimera",
    jurisdiction: "santaFe",
    jurisdictionTitle: "Santa Fe",
    officialTitles: ["QUINIELA DE SANTA FE PRIMERA MATUTINA"],
    title: "Primera Matutina",
    scheduledTime: "12:15",
    accent: "#22c55e",
  },
  {
    key: "santaFeVespertina",
    jurisdiction: "santaFe",
    jurisdictionTitle: "Santa Fe",
    officialTitles: ["QUINIELA DE SANTA FE VESPERTINA"],
    title: "Vespertina",
    scheduledTime: "18:00",
    accent: "#22c55e",
  },
];
