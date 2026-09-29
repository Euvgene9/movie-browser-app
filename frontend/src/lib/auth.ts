import { apiFetch } from './api';
import type { AuthResponse } from './types';

const TOKEN_KEY = 'accessToken';

export async function signup(email: string, password: string): Promise<void> {
    const res = await apiFetch<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false,
    });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
}

export async function login(email: string, password: string): Promise<void> {
    const res = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false,
    });
    localStorage.setItem(TOKEN_KEY, res.accessToken);
}

export function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem(TOKEN_KEY);
}