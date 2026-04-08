import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-shell__backdrop app-shell__backdrop--one" />
      <div className="app-shell__backdrop app-shell__backdrop--two" />
      <Sidebar />
      <div className="app-shell__main">
        <Topbar />
        <main className="app-shell__page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
