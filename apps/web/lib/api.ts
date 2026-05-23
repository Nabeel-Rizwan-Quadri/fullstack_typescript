export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function apiFetch(path: string, init: RequestInit = {}) {
  return await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
  });
}

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

export async function readApiError(res: Response): Promise<string> {
  const fallback = `Request failed (${res.status})`;
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return res.statusText || fallback;
  }

  try {
    const data = (await res.json()) as ApiErrorBody;
    if (Array.isArray(data.message)) {
      return data.message.join(', ');
    }
    if (typeof data.message === 'string' && data.message.trim().length > 0) {
      return data.message;
    }
    if (typeof data.error === 'string' && data.error.trim().length > 0) {
      return data.error;
    }
  } catch {
    return res.statusText || fallback;
  }

  return res.statusText || fallback;
}
