export const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

function padTwoDigits(value: string) {
  return value.padStart(2, "0");
}

export function getArgentinaToday(date = new Date()) {
  const parts = new Intl.DateTimeFormat("es-AR", {
    timeZone: ARGENTINA_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);

  const day = parts.find((part) => part.type === "day")?.value ?? "00";
  const month = parts.find((part) => part.type === "month")?.value ?? "00";
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";

  return `${day}/${month}/${year}`;
}

export function normalizeOfficialDate(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const cleanedValue = value.replace(/\s+/g, " ").trim();
  const isoMatch = cleanedValue.match(
    /(\d{4})\s*[\/.-]\s*(\d{1,2})\s*[\/.-]\s*(\d{1,2})/,
  );

  if (isoMatch) {
    const [, year, month, day] = isoMatch;

    return `${padTwoDigits(day)}/${padTwoDigits(month)}/${year}`;
  }

  const dayFirstMatch = cleanedValue.match(
    /(\d{1,2})\s*[\/.-]\s*(\d{1,2})\s*[\/.-]\s*(\d{2,4})/,
  );

  if (dayFirstMatch) {
    const [, day, month, rawYear] = dayFirstMatch;
    const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;

    return `${padTwoDigits(day)}/${padTwoDigits(month)}/${year}`;
  }

  return cleanedValue;
}

export function normalizeOfficialTime(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const match = value.match(/(\d{1,2})\s*:\s*(\d{2})/);

  if (!match) {
    return value.replace(/\s+/g, " ").trim();
  }

  const [, hours, minutes] = match;

  return `${padTwoDigits(hours)}:${minutes}`;
}
