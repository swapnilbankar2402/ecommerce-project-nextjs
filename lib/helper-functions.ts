import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function getTokenFromRequest(request: NextRequest) {
  const cookieStore = await cookies();
  let token = cookieStore.get("accessToken")?.value;

  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }
  return token;
}
