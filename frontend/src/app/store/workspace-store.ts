import { create } from 'zustand';
import type { Workspace } from 'entities/workspace/types';
import { workspacesApi } from 'shared/api/workspaces';

type WorkspaceState = {
  items: Workspace[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  prepend: (workspace: Workspace) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  items: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true, error: null });

    try {
      const items = await workspacesApi.list();
      set({ items, loading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось загрузить пространства';
      set({ error: message, loading: false });
    }
  },
  prepend(workspace) {
    set((state) => ({
      items: [workspace, ...state.items.filter((item) => item.id !== workspace.id)],
    }));
  },
}));
