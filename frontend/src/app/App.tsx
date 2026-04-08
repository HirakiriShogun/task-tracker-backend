import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProjectPage } from 'pages/project/ProjectPage';
import { WorkspaceDetailsPage } from 'pages/workspace-details/WorkspaceDetailsPage';
import { WorkspacesPage } from 'pages/workspaces/WorkspacesPage';
import { authApi } from 'shared/api/auth';
import { getErrorText } from 'shared/lib/format';
import { LoadingState } from 'shared/ui/LoadingState';
import { AuthScreen } from 'features/auth/AuthScreen';
import { AppShell } from 'widgets/layout/AppShell';
import { useAuthStore } from './store/auth-store';

export function App() {
  const token = useAuthStore((state) => state.token);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!token) {
        setStatus('guest');
        return;
      }

      setStatus('booting');
      setBootError(null);

      try {
        const currentUser = await authApi.me();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        if (!cancelled) {
          clearSession();
          setBootError(getErrorText(error));
        }
      }
    }

    if (!user || status === 'booting') {
      void bootstrap();
    }

    return () => {
      cancelled = true;
    };
  }, [clearSession, setStatus, setUser, status, token, user]);

  if (status === 'booting') {
    return (
      <div className="app-root">
        <LoadingState
          description="Восстанавливаем сессию и данные."
          title="Запуск"
        />
      </div>
    );
  }

  if (status !== 'authenticated' || !user) {
    return <AuthScreen bootError={bootError} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<Navigate replace to="/workspaces" />} path="/" />
          <Route element={<WorkspacesPage />} path="/workspaces" />
          <Route
            element={<WorkspaceDetailsPage />}
            path="/workspaces/:id"
          />
          <Route element={<ProjectPage />} path="/projects/:id" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
