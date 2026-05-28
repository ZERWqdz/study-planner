export type SubjectId =
  | 'data-structure'
  | 'computer-organization'
  | 'operating-system'
  | 'computer-network'
  | 'math'
  | 'english'
  | 'politics';

export type PhaseId = 'foundation' | 'reinforcement' | 'sprint';

export type TaskType = 'textbook' | 'video-lecture' | 'exercise' | 'review' | 'memorize' | 'mock-exam';

export interface Task {
  id: string;
  subjectId: SubjectId;
  title: string;
  description?: string;
  taskType: TaskType;
  estimatedMinutes: number;
  carryOver?: boolean;
}

export interface DayPlan {
  date: string;
  dayOfWeek: number;
  phaseId: PhaseId;
  isRestDay: boolean;
  tasks: Task[];
  note?: string;
}

export interface AppState {
  version: number;
  completionMap: Record<string, string[]>;
  streak: number;
  lastActiveDate: string | null;
  theme: 'dark' | 'light';
}

export interface StudyStats {
  totalDays: number;
  completedDays: number;
  totalTasks: number;
  completedTasks: number;
  bySubject: Record<SubjectId, { total: number; completed: number }>;
  byPhase: Record<PhaseId, { total: number; completed: number }>;
  currentStreak: number;
  bestStreak: number;
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  color: string;
  icon: string;
}

export interface PhaseInfo {
  id: PhaseId;
  name: string;
  color: string;
  startDate: string;
  endDate: string;
}
