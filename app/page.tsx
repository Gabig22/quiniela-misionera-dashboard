import Dashboard from "@/components/Dashboard";
import { getResultsPayload } from "@/lib/results/getResultsPayload";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { payload } = await getResultsPayload();

  return <Dashboard initialNow={payload.fetchedAt} initialResults={payload} />;
}
