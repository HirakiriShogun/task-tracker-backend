import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { Workspace } from '@/entities/workspace/model/types';
import { useTaskTrackerStore } from '@/app/store/use-task-tracker-store';
import { workspacesApi } from '@/shared/api/endpoints/workspaces';
import { getErrorMessage } from '@/shared/lib/errors';
import { Badge } from '@/shared/ui/Badge';

type AppShellProps = {
  children: ReactNode;
};

function getViewLabel(pathname: string) {
  if (pathname.startsWith('/projects/')) {
    return 'Project canvas';
  }

  if (pathname.startsWith('/workspaces/')) {
    return 'Workspace hub';
  }

  return 'Workspaces';
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { currentWorkspace, currentProject } = useTaskTrackerStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const data = await workspacesApi.list();
        setWorkspaces(data);
        setError('');
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    };

    void loadWorkspaces();
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="app-shell__ambient app-shell__ambient--violet" />
      <div className="app-shell__ambient app-shell__ambient--cyan" />

      <aside className="app-sidebar">
        <div className="app-sidebar__brand">
          <div className="app-sidebar__brand-mark">P</div>
          <div>
            <strong>Pulseboard</strong>
            <span>Task tracker MVP</span>
          </div>
        </div>

        <nav className="app-sidebar__nav">
          <NavLink
            to="/workspaces"
            className={({ isActive }) =>
              isActive && location.pathname === '/workspaces'
                ? 'sidebar-link sidebar-link--active'
                : 'sidebar-link'
            }
          >
            Workspaces
          </NavLink>
        </nav>

        <div className="app-sidebar__section">
          <div className="app-sidebar__section-header">
            <span>Quick access</span>
            <Badge tone="neutral">{workspaces.length}</Badge>
          </div>
          <div className="app-sidebar__workspace-list">
            {workspaces.map((workspace) => (
              <NavLink
                key={workspace.id}
                to={`/workspaces/${workspace.id}`}
                className={({ isActive }) =>
                  isActive ? 'workspace-link workspace-link--active' : 'workspace-link'
                }
              >
                <span className="workspace-link__dot" />
                <span>{workspace.name}</span>
              </NavLink>
            ))}
            {error ? <p className="sidebar-error">{error}</p> : null}
          </div>
        </div>

        <div className="app-sidebar__footer">
          <span>Premium product surface</span>
          <p>Layered layout, quick navigation and fluid task execution.</p>
        </div>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <div>
            <span className="app-header__eyebrow">{getViewLabel(location.pathname)}</span>
            <div className="app-header__title-row">
              <h1>{currentProject?.name || currentWorkspace?.name || 'Task tracker'}</h1>
              {currentWorkspace ? <Badge tone="accent">{currentWorkspace.name}</Badge> : null}
            </div>
          </div>
          <div className="app-header__meta">
            <Badge tone="neutral">{new Date().toLocaleDateString()}</Badge>
            {currentProject ? <Badge tone="success">Project active</Badge> : null}
          </div>
        </header>

        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
