import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppRootLayout } from './layout/AppRootLayout';
import { ProjectPage } from '@/pages/project/ProjectPage';
import { WorkspaceDetailsPage } from '@/pages/workspace-details/WorkspaceDetailsPage';
import { WorkspacesPage } from '@/pages/workspaces/WorkspacesPage';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppRootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/workspaces" replace />,
      },
      {
        path: '/workspaces',
        element: <WorkspacesPage />,
      },
      {
        path: '/workspaces/:id',
        element: <WorkspaceDetailsPage />,
      },
      {
        path: '/projects/:id',
        element: <ProjectPage />,
      },
    ],
  },
]);
