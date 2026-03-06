import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

import jwt from 'jsonwebtoken';
import { parse, serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 's3cr3t-jwt-key';
const COOKIE_NAME = '__token';
const TOKEN_EXPIRY = '7d'; // 7 days

interface JwtPayload {
    userId: string;
}

/**
 * Create a signed JWT token for a user
 */
export function createToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Get the JWT token from the request cookies
 */
export function getTokenFromRequest(request: Request): string | null {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;
    const cookies = parse(cookieHeader);
    return cookies[COOKIE_NAME] || null;
}

/**
 * Create a Set-Cookie header with the JWT token
 */
export function createTokenCookie(token: string, remember: boolean = true): string {
    return serialize(COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined, // 7 days or session
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}

/**
 * Create a Set-Cookie header that clears the JWT token
 */
export function clearTokenCookie(): string {
    return serialize(COOKIE_NAME, '', {
        httpOnly: true,
        maxAge: 0,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}
