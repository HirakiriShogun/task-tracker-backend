import { Outlet } from 'react-router-dom';
import { AppShell } from '@/widgets/app-shell/AppShell';

export function AppRootLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
