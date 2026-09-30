import { TripDetailPage } from "@/features/trip";

interface TripRouteParams {
  tripId: string;
}

export default async function TripPage({
  params,
}: {
  params: Promise<TripRouteParams>;
}) {
  const { tripId } = await params;
  return <TripDetailPage tripId={decodeURIComponent(tripId)} />;
}
