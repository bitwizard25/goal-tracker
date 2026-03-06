import { redirect } from '@remix-run/node';
import { User } from '../models/User';
import {
    createToken,
    verifyToken,
    getTokenFromRequest,
    createTokenCookie,
    clearTokenCookie,
} from './session.server';

/**
 * Get user ID from the JWT in request cookies
 */
export async function getUserId(request: Request): Promise<string | null> {
    const token = getTokenFromRequest(request);
    if (!token) return null;

    const payload = verifyToken(token);
    return payload?.userId || null;
}

/**
 * Require a valid user ID or redirect to login
 */
export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname,
): Promise<string> {
    const userId = await getUserId(request);
    if (!userId) {
        const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
        throw redirect(`/auth/login?${searchParams}`);
    }
    return userId;
}

/**
 * Get the full user object from the JWT
 */
export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (!userId) return null;

    try {
        const user = await User.findById(userId).select('-password_hash');
        return user;
    } catch {
        throw logout(request);
    }
}

/**
 * Create a JWT token and set it as a cookie, then redirect
 */
export async function createUserSession({
    request: _request,
    userId,
    remember,
    redirectTo,
}: {
    request: Request;
    userId: string;
    remember: boolean;
    redirectTo: string;
}) {
    const token = createToken(userId);
    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': createTokenCookie(token, remember),
        },
    });
}

/**
 * Clear the JWT cookie and redirect to login
 */
export async function logout(_request: Request) {
    return redirect('/auth/login', {
        headers: {
            'Set-Cookie': clearTokenCookie(),
        },
    });
}
