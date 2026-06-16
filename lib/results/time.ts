export const ARGENTINA_TIME_ZONE = "America/Argentina/Buenos_Aires";

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
