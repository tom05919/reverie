import { NextResponse } from "next/server";
import { liveNegotiations } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(liveNegotiations);
}
