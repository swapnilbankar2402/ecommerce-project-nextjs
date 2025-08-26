import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import { signAccessToken, verifyRefreshToken, setRefreshCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';

interface RefreshResponseBody {
  success: boolean;
  accessToken?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshResponseBody>
) {
  try {
    await connectDB();
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Refresh token not found' });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }
    
    // Check if user exists
    // const user = await User.findById(decoded.userId);
    // if (!user) {
    //   // Clear invalid refresh token
    //   res.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
    //   return res.status(401).json({ success: false, error: 'User not found' });
    // }

    // // Generate new access token
    // const newAccessToken = signAccessToken({ 
    //   userId: user._id.toString(), 
    //   role: user.role 
    // });

    // return res.status(200).json({
    //   success: true,
    //   accessToken: newAccessToken
    // });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
}