import { create } from 'zustand';

type NamedEntity = {
  id: string;
  name: string;
};

type TaskTrackerStore = {
  currentWorkspace: NamedEntity | null;
  currentProject: NamedEntity | null;
  selectedTaskId: string | null;
  setCurrentWorkspace: (workspace: NamedEntity | null) => void;
  setCurrentProject: (project: NamedEntity | null) => void;
  setSelectedTaskId: (taskId: string | null) => void;
  resetProjectContext: () => void;
};

export const useTaskTrackerStore = create<TaskTrackerStore>((set) => ({
  currentWorkspace: null,
  currentProject: null,
  selectedTaskId: null,
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  resetProjectContext: () =>
    set({
      currentProject: null,
      selectedTaskId: null,
    }),
}));
