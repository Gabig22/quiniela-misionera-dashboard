import * as cheerio from "cheerio";
import { DRAW_DEFINITIONS } from "@/lib/results/drawDefinitions";
import {
  normalizeOfficialDate,
  normalizeOfficialTime,
} from "@/lib/results/time";
import type {
  ParsedOfficialDraw,
  ParsedOfficialExtracts,
  Prize,
} from "@/lib/results/types";

function normalizeLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeTitle(title: string) {
  return stripAccents(title)
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

const ALLOWED_DRAW_TITLES = new Set(
  DRAW_DEFINITIONS.map((definition) => normalizeTitle(definition.officialTitle)),
);

function htmlToLines(html: string) {
  const htmlWithBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(h[1-6]|p|div|section|article|tr|li|table|thead|tbody|tfoot)>/gi, "\n")
    .replace(/<(td|th)\b[^>]*>/gi, "\n");

  const $ = cheerio.load(htmlWithBreaks);
  $("script, style, noscript").remove();

  return $.root()
    .text()
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean);
}

function readDateValue(lines: string[], index: number) {
  const normalizedLine = stripAccents(lines[index]);
  const inlineDate = normalizedLine.match(
    /\bFECHA\b\s*:?\s*(\d{1,2}\s*[\/.-]\s*\d{1,2}\s*[\/.-]\s*\d{2,4})/i,
  )?.[1];

  return inlineDate ?? lines[index + 1] ?? "";
}

function readTimeValue(lines: string[], index: number) {
  const normalizedLine = stripAccents(lines[index]);
  const inlineTime = normalizedLine.match(
    /\bHORA\b\s*:?\s*(\d{1,2}\s*:\s*\d{2})/i,
  )?.[1];

  return inlineTime ?? lines[index + 1] ?? "";
}

function isSectionBoundary(line: string) {
  return (
    /^FECHA\b/i.test(line) ||
    /^HORA\b/i.test(line) ||
    /^QUINIELA\s+/i.test(line) ||
    /^POCEADA\s+/i.test(line) ||
    /^MINI\s+POCEADA\s+/i.test(line) ||
    /^MINI\s+QUINIELA\s+/i.test(line)
  );
}

function parseDrawAt(
  lines: string[],
  index: number,
  resultDate: string,
  resultTime: string,
): ParsedOfficialDraw {
  const officialTitle = lines[index];
  let drawNumber: string | null = null;
  const numbers: string[] = [];

  for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
    const line = lines[cursor];

    if (isSectionBoundary(line)) {
      break;
    }

    const drawNumberMatch = line.match(/SORTEO\s*N\D*([0-9]+)/i);

    if (drawNumberMatch) {
      drawNumber = drawNumberMatch[1];
      continue;
    }

    const prizeNumbers = line.match(/\b\d{4}\b/g);

    if (prizeNumbers) {
      numbers.push(...prizeNumbers);
    }

    if (numbers.length >= 20) {
      break;
    }
  }

  const prizes: Prize[] = numbers.slice(0, 20).map((number, prizeIndex) => ({
    position: prizeIndex + 1,
    number,
  }));

  return {
    officialTitle,
    resultDate,
    resultTime,
    drawNumber,
    prizes,
  };
}

export function parseOfficialExtracts(html: string): ParsedOfficialExtracts {
  const lines = htmlToLines(html);
  const sourceUpdatedAt =
    lines
      .find((line) => /^Ultima actualizacion:/i.test(stripAccents(line)))
      ?.split(":")
      .slice(1)
      .join(":")
      .trim() || null;

  const draws: ParsedOfficialDraw[] = [];
  let currentDate = "";
  let currentTime = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (/\bFECHA\b/i.test(stripAccents(line))) {
      currentDate = normalizeOfficialDate(readDateValue(lines, index));

      if (!/\bHORA\b/i.test(stripAccents(line))) {
        continue;
      }
    }

    if (/\bHORA\b/i.test(stripAccents(line))) {
      currentTime = normalizeOfficialTime(readTimeValue(lines, index));
      continue;
    }

    if (
      /^QUINIELA\s+/i.test(line) &&
      currentDate &&
      currentTime &&
      ALLOWED_DRAW_TITLES.has(normalizeTitle(line))
    ) {
      draws.push(parseDrawAt(lines, index, currentDate, currentTime));
    }
  }

  return {
    sourceUpdatedAt,
    draws,
  };
}
