import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
    const { logout } = await import('../services/auth.server');
    return logout(request);
};

export const loader = async () => {
    const { redirect } = await import('@remix-run/node');
    return redirect('/');
};
