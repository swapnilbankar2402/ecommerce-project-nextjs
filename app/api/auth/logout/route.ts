import { NextResponse } from "next/server";
import { clearRefreshCookie } from "@/lib/auth";

export async function POST() {
  clearRefreshCookie();
  return NextResponse.json({ message: "Logged out successfully" });
}
