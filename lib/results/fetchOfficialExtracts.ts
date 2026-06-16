export const OFFICIAL_EXTRACTS_URL =
  "https://www.loteriademisiones.com.ar/extractos/";

export async function fetchOfficialExtracts() {
  const response = await fetch(OFFICIAL_EXTRACTS_URL, {
    cache: "no-store",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "es-AR,es;q=0.9,en;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Referer: "https://www.loteriademisiones.com.ar/",
      "User-Agent":
        "Mozilla/5.0 (compatible; QuinielaMisioneraDashboard/1.0; +https://www.loteriademisiones.com.ar/)",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Official extracts request failed with status ${response.status}`,
    );
  }

  return response.text();
}
