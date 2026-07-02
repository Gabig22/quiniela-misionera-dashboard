import { NextResponse } from "next/server";
import { getResultsPayload } from "@/lib/results/getResultsPayload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  const { payload, status } = await getResultsPayload();

  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
