// import { NextResponse } from "next/server";
// import { clearRefreshCookie } from "@/lib/auth";

// export async function POST() {
//   clearRefreshCookie();
//   return NextResponse.json({ message: "Logged out successfully" });
// }


// pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface LogoutResponseBody {
  success: boolean;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponseBody>
) {
  try {
    // Clear refresh token cookie
    res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}