export const OFFICIAL_EXTRACTS_URL =
  "https://www.loteriademisiones.com.ar/extractos/";

export async function fetchOfficialExtracts() {
  const response = await fetch(OFFICIAL_EXTRACTS_URL, {
    cache: "no-store",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "QuinielaMisioneraDashboard/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Official extracts request failed with status ${response.status}`,
    );
  }

  return response.text();
}
