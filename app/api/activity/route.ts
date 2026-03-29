import { NextResponse } from "next/server";
import { activityFeed as mockActivity } from "@/lib/mock-data";
import { getActivityFromSessions } from "@/lib/negotiation/bridge";

export async function GET() {
  const realActivity = getActivityFromSessions();
  const all = [...realActivity, ...mockActivity];

  all.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return NextResponse.json({ activity: all });
}
