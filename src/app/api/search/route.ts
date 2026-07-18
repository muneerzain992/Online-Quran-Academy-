import { NextResponse } from "next/server";
import { searchContent } from "@/lib/cms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await searchContent(q);
  return NextResponse.json({ ok: true, q, results });
}
