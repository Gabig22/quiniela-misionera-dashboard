export type DrawKey =
  | "previa"
  | "primera"
  | "matutina"
  | "matutinaPlus"
  | "vespertina"
  | "nocturna"
  | "nocturnaPlus";

export type DrawStatus = "published" | "pending";

export type Prize = {
  position: number;
  number: string;
};

export type OfficialDraw = {
  key: DrawKey;
  title: string;
  scheduledTime: string;
  resultDate: string | null;
  resultTime: string | null;
  drawNumber: string | null;
  status: DrawStatus;
  prizeCount: number;
  prizes: Prize[];
  accent: string;
};

export type ParsedOfficialDraw = {
  officialTitle: string;
  resultDate: string;
  resultTime: string;
  drawNumber: string | null;
  prizes: Prize[];
};

export type ParsedOfficialExtracts = {
  sourceUpdatedAt: string | null;
  draws: ParsedOfficialDraw[];
};

export type ResultsApiSuccess = {
  source: "IPLyC Misiones";
  sourceUrl: string;
  sourceUpdatedAt: string | null;
  fetchedAt: string;
  today: string;
  draws: OfficialDraw[];
  latestPublishedDraw: OfficialDraw | null;
  debug: {
    publishedCount: number;
    fetchMode?: string;
    directStatus?: number | null;
    parsedDrawsCount?: number;
    draws: Array<{
      key: DrawKey;
      resultDate: string | null;
      resultTime: string | null;
      drawNumber: string | null;
      prizeCount: number;
      prizesLength: number;
      firstPrize: string | null;
      status: DrawStatus;
    }>;
  };
};

export type ResultsApiError = {
  source: "IPLyC Misiones";
  sourceUrl: string;
  fetchedAt: string;
  today: string;
  draws: OfficialDraw[];
  latestPublishedDraw: null;
  debug: {
    publishedCount: number;
    fetchMode?: string;
    directStatus?: number | null;
    parsedDrawsCount?: number;
    draws: Array<{
      key: DrawKey;
      resultDate: string | null;
      resultTime: string | null;
      drawNumber: string | null;
      prizeCount: number;
      prizesLength: number;
      firstPrize: string | null;
      status: DrawStatus;
    }>;
  };
  error: {
    code: "OFFICIAL_SOURCE_UNAVAILABLE" | "OFFICIAL_SOURCE_PARSE_ERROR";
    message: string;
  };
};

export type ResultsApiResponse = ResultsApiSuccess | ResultsApiError;
