import { apiBaseUrl } from '@/shared/config/env';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type ErrorPayload = {
  message?: string | string[];
};

export class ApiError extends Error {
  status: number;
  payload?: ErrorPayload;

  constructor(message: string, status: number, payload?: ErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

function getErrorMessage(payload?: ErrorPayload) {
  if (!payload?.message) {
    return 'Unexpected request error';
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(', ');
  }

  return payload.message;
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const payload = await parseResponse<T | ErrorPayload | undefined>(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload as ErrorPayload | undefined),
      response.status,
      payload as ErrorPayload | undefined,
    );
  }

  return payload as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
