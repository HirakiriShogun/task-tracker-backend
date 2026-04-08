import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from 'app/store/auth-store';
import { formatRole } from 'shared/lib/format';
import { Button } from 'shared/ui/Button';

function getContextLabel(pathname: string) {
  if (pathname.startsWith('/projects/')) {
    return 'Проект';
  }

  if (pathname.startsWith('/workspaces/')) {
    return 'Пространство';
  }

  return 'Обзор';
}

export function Topbar() {
  const pathname = useLocation().pathname;
  const user = useAuthStore((state) => state.user);
  const [copied, setCopied] = useState(false);

  async function copyUserId() {
    if (!user) {
      return;
    }

    await navigator.clipboard.writeText(user.id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <header className="topbar">
      <div>
        <span className="topbar__eyebrow">Панель</span>
        <h1 className="topbar__title">{getContextLabel(pathname)}</h1>
      </div>
      <div className="topbar__actions">
        <div className="topbar__meta">
          <span>{formatRole(user?.role)}</span>
          <strong>{user?.fullName}</strong>
        </div>
        <Button onClick={copyUserId} size="sm" type="button" variant="secondary">
          {copied ? 'ID скопирован' : 'Скопировать ID'}
        </Button>
      </div>
    </header>
  );
}
