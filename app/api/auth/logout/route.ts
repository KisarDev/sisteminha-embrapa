import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/src/core/http/auth";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
