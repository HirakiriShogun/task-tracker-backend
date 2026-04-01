import type { BadgeTone } from '@/shared/ui/Badge';
import type { TaskPriority, TaskStatus } from './types';

export const taskStatusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export const taskStatusLabels: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const taskStatusTone: Record<TaskStatus, BadgeTone> = {
  TODO: 'neutral',
  IN_PROGRESS: 'accent',
  DONE: 'success',
};

export const taskPriorityTone: Record<TaskPriority, BadgeTone> = {
  LOW: 'neutral',
  MEDIUM: 'warning',
  HIGH: 'danger',
};
