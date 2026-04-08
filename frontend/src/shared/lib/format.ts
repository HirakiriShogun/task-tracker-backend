import type { ApiError } from 'shared/api/client';

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getErrorText(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Что-то пошло не так';
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'ApiError'
  );
}

export function formatRole(role?: string) {
  if (role === 'ADMIN') {
    return 'Администратор';
  }

  if (role === 'USER') {
    return 'Пользователь';
  }

  return 'Участник';
}

export function formatTaskStatus(status: string) {
  if (status === 'IN_PROGRESS') {
    return 'В работе';
  }

  if (status === 'DONE') {
    return 'Готово';
  }

  return 'Нужно сделать';
}

export function formatTaskPriority(priority: string) {
  if (priority === 'HIGH') {
    return 'Высокий';
  }

  if (priority === 'MEDIUM') {
    return 'Средний';
  }

  return 'Низкий';
}
