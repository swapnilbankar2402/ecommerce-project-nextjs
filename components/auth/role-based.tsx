// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/User';
import { signAccessToken, signRefreshToken, setRefreshCookie } from '@/lib/auth';
import { connectDB } from '@/lib/db';

interface LoginRequestBody {
    email: string;
    password: string;
}

interface LoginResponseBody {
    success: boolean;
    accessToken?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        roles: ("customer" | "vendor" | "admin")[];
        avatarUrl?: string;
        vendorProfile?: string;
        isActive: boolean;
        lastLogin?: Date;
    };
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<LoginResponseBody>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        await connectDB();
        const { email, password }: LoginRequestBody = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ success: false, error: 'Account is deactivated' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create tokens
        const accessToken = signAccessToken({
            userId: user._id.toString(),
            roles: user.roles
        });
        const refreshToken = signRefreshToken({ userId: user._id.toString() });

        // Set HttpOnly cookie for refresh token
        setRefreshCookie(res, refreshToken);

        return res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                roles: user.roles,
                avatarUrl: user.avatarUrl,
                vendorProfile: user.vendorProfile?.toString(),
                isActive: user.isActive,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}