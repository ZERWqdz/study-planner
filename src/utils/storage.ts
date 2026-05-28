import type { AppState } from '@/types';
import { STORAGE_KEY } from './constants';

const DEFAULT_STATE: AppState = {
  version: 1,
  completionMap: {},
  streak: 0,
  lastActiveDate: null,
  theme: 'dark',
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const state = JSON.parse(raw) as AppState;
    if (state.version !== 1) return { ...DEFAULT_STATE };
    return state;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage 满了就忽略
  }
}

export function getCompletedTasks(dateStr: string): string[] {
  const state = loadState();
  return state.completionMap[dateStr] ?? [];
}

export function toggleTaskCompletion(dateStr: string, taskId: string): boolean {
  const state = loadState();
  const completed = state.completionMap[dateStr] ?? [];
  const idx = completed.indexOf(taskId);
  if (idx >= 0) {
    completed.splice(idx, 1);
  } else {
    completed.push(taskId);
  }
  state.completionMap[dateStr] = completed;
  state.lastActiveDate = dateStr;
  saveState(state);
  return idx < 0; // true = 现在已完成
}

export function setTheme(theme: 'dark' | 'light'): void {
  const state = loadState();
  state.theme = theme;
  saveState(state);
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
