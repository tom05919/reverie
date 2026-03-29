import { NextResponse } from "next/server";
import { deals } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(deals);
}
