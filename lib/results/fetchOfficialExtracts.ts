export const OFFICIAL_EXTRACTS_URL =
  "https://www.loteriademisiones.com.ar/extractos/";

export type OfficialExtractsFetchMode = "direct" | "text-fallback";

type OfficialExtractsFetchResult = {
  html: string;
  fetchMode: OfficialExtractsFetchMode;
  directStatus: number | null;
};

async function fetchText(url: string) {
  return fetch(url, {
    cache: "no-store",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
      "Accept-Language": "es-AR,es;q=0.9,en;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "User-Agent": "Mozilla/5.0",
      "X-No-Cache": "true",
    },
  });
}

function buildTextFallbackUrl() {
  const targetUrl = new URL(OFFICIAL_EXTRACTS_URL);
  const cacheKey = Math.floor(Date.now() / 60000).toString();

  targetUrl.searchParams.set("_", cacheKey);

  return `https://r.jina.ai/http://${targetUrl.toString()}`;
}

export async function fetchOfficialExtracts() {
  let directStatus: number | null = null;

  if (process.env.IPLYC_FETCH_MODE !== "text-fallback") {
    try {
      const directResponse = await fetchText(OFFICIAL_EXTRACTS_URL);
      directStatus = directResponse.status;

      if (directResponse.ok) {
        return {
          html: await directResponse.text(),
          fetchMode: "direct",
          directStatus,
        } satisfies OfficialExtractsFetchResult;
      }
    } catch {
      directStatus = null;
    }
  }

  const fallbackResponse = await fetchText(buildTextFallbackUrl());

  if (!fallbackResponse.ok) {
    throw new Error(
      `Official extracts request failed with status ${directStatus ?? "network-error"} and fallback failed with status ${fallbackResponse.status}`,
    );
  }

  return {
    html: await fallbackResponse.text(),
    fetchMode: "text-fallback",
    directStatus,
  } satisfies OfficialExtractsFetchResult;
}
