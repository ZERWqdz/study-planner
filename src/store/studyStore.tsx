import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { AppState } from '@/types';
import { loadState, saveState, setTheme as saveTheme } from '@/utils/storage';
import { getTodayStr } from '@/utils/date';
import { getFullPlan } from '@/data/planGenerator';

interface StudyContextValue {
  state: AppState;
  toggleTask: (dateStr: string, taskId: string) => boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  isTodayComplete: boolean;
}

type Action =
  | { type: 'TOGGLE_TASK'; date: string; taskId: string }
  | { type: 'SET_THEME'; theme: 'dark' | 'light' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_TASK': {
      const completed = [...(state.completionMap[action.date] ?? [])];
      const idx = completed.indexOf(action.taskId);
      if (idx >= 0) {
        completed.splice(idx, 1);
      } else {
        completed.push(action.taskId);
      }
      const newState: AppState = {
        ...state,
        completionMap: { ...state.completionMap, [action.date]: completed },
        lastActiveDate: getTodayStr(),
      };
      saveState(newState);
      return newState;
    }
    case 'SET_THEME': {
      const newState: AppState = { ...state, theme: action.theme };
      saveState(newState);
      saveTheme(action.theme);
      return newState;
    }
    default:
      return state;
  }
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  const toggleTask = useCallback((dateStr: string, taskId: string): boolean => {
    const completed = state.completionMap[dateStr] ?? [];
    const isNowCompleted = !completed.includes(taskId);
    dispatch({ type: 'TOGGLE_TASK', date: dateStr, taskId });
    return isNowCompleted;
  }, [state.completionMap]);

  const setAppTheme = useCallback((theme: 'dark' | 'light') => {
    dispatch({ type: 'SET_THEME', theme });
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, []);

  const isTodayComplete = (() => {
    const today = getTodayStr();
    const plan = getFullPlan();
    const day = plan.find((d) => d.date === today);
    if (!day || day.isRestDay || day.tasks.length === 0) return false;
    const done = state.completionMap[today] ?? [];
    return day.tasks.every((t) => done.includes(t.id));
  })();

  return (
    <StudyContext.Provider value={{ state, toggleTask, setTheme: setAppTheme, isTodayComplete }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within StudyProvider');
  return ctx;
}
