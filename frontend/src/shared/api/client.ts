import { useAuthStore } from 'app/store/auth-store';
import { API_BASE_URL } from './config';

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = RequestInit & {
  json?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (!isObject(payload)) {
    return fallback;
  }

  const message = payload.message;

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
) {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.json === undefined
        ? undefined
        : JSON.stringify(options.json),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().clearSession();
    }

    throw new ApiError(
      getErrorMessage(payload, 'Не удалось выполнить запрос'),
      response.status,
      payload,
    );
  }

  return payload as T;
}
