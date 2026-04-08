import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useWorkspaceStore } from 'app/store/workspace-store';
import { useAuthStore } from 'app/store/auth-store';
import { getInitials } from 'shared/lib/format';
import { Badge } from 'shared/ui/Badge';
import { Button } from 'shared/ui/Button';
import { LoadingState } from 'shared/ui/LoadingState';

export function Sidebar() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const items = useWorkspaceStore((state) => state.items);
  const loading = useWorkspaceStore((state) => state.loading);
  const load = useWorkspaceStore((state) => state.load);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">TT</div>
        <div>
          <span className="sidebar__eyebrow">Трекер задач</span>
          <strong>Пространства</strong>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink
          className={({ isActive }) =>
            `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
          }
          to="/workspaces"
        >
          Пространства
        </NavLink>
      </nav>

      <section className="sidebar__section">
        <div className="sidebar__section-title">
          <span>Мои пространства</span>
          <Badge tone="blue">{items.length}</Badge>
        </div>
        {loading && items.length === 0 ? (
          <LoadingState
            compact
            description="Обновляем список."
            title="Загрузка"
          />
        ) : null}
        <div className="sidebar__workspace-list">
          {items.map((workspace) => (
            <NavLink
              key={workspace.id}
              className={({ isActive }) =>
                `workspace-chip ${isActive ? 'workspace-chip--active' : ''}`
              }
              to={`/workspaces/${workspace.id}`}
            >
              <span>{workspace.name}</span>
              {location.pathname === `/workspaces/${workspace.id}` ? (
                <span className="workspace-chip__marker" />
              ) : null}
            </NavLink>
          ))}
        </div>
      </section>

      <div className="sidebar__profile">
        <div className="sidebar__avatar">{getInitials(user.fullName)}</div>
        <div className="sidebar__profile-copy">
          <strong>{user.fullName}</strong>
          <span>{user.email}</span>
          <code>{user.id}</code>
        </div>
        <Button onClick={clearSession} size="sm" type="button" variant="ghost">
          Выйти
        </Button>
      </div>
    </aside>
  );
}
