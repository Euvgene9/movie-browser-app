const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

function getToken(): string | null {
    if (typeof window === 'undefined') return null; // SSR/server component guard
    return localStorage.getItem('accessToken');
}

interface RequestOptions extends RequestInit {
    auth?: boolean; // attach the JWT if true (default true)
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { auth = true, headers, ...rest } = options;

    const finalHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (auth) {
        const token = getToken();
        if (token) {
            (finalHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: res.statusText }));
        throw new ApiError(res.status, body.message ?? 'Request failed');
    }

    // DELETE endpoints sometimes return empty bodies
    const text = await res.text();
    return text ? JSON.parse(text) : (undefined as T);
}