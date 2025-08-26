// import { NextApiRequest, NextApiResponse } from "next";
// import User from "@/models/User";
// import {
//   signAccessToken,
//   signRefreshToken,
//   setRefreshCookie,
// } from "@/lib/auth";
// import { connectDB } from "@/lib/db";

import {
  setRefreshCookie,
  signAccessToken,
  signRefreshToken,
} from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface LoginRequestBody {
  email: string;
  password: string;
}

// interface LoginResponseBody {
//   success: boolean;
//   accessToken?: string;
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     storeName?: string;
//   };
//   error?: string;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<LoginResponseBody>
// ) {
//   if (req.method !== "POST") {
//     return res
//       .status(405)
//       .json({ success: false, error: "Method not allowed" });
//   }

//   try {
//     await connectDB();
//     const { email, password }: LoginRequestBody = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//       return res
//         .status(401)
//         .json({ success: false, error: "Invalid credentials" });
//     }

//     // Create tokens
//     const accessToken = signAccessToken({
//       userId: user._id.toString(),
//       role: user.role,
//     });
//     const refreshToken = signRefreshToken({ userId: user._id.toString() });

//     // Set HttpOnly cookie for refresh token
//     setRefreshCookie(refreshToken);

//     return res.status(200).json({
//       success: true,
//       accessToken,
//       user: {
//         id: user._id.toString(),
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         storeName: user.storeName,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// }

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password }: LoginRequestBody = await req.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create tokens
    const accessToken = signAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    // Set HttpOnly cookie for refresh token
    setRefreshCookie(refreshToken);

    return NextResponse.json(
      {
        success: true,
        accessToken,
        // user: { ...savedUser },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
