import type { SubjectInfo, PhaseInfo } from '@/types';

export const START_DATE = '2026-05-28';
export const EXAM_DATE = '2026-12-19';

export const SUBJECTS: SubjectInfo[] = [
  { id: 'data-structure', name: '数据结构', shortName: 'DS', color: '#3B82F6', icon: '🧩' },
  { id: 'computer-organization', name: '计算机组成原理', shortName: 'CO', color: '#EF4444', icon: '⚙️' },
  { id: 'operating-system', name: '操作系统', shortName: 'OS', color: '#8B5CF6', icon: '💻' },
  { id: 'computer-network', name: '计算机网络', shortName: 'CN', color: '#10B981', icon: '🌐' },
  { id: 'math', name: '数学一', shortName: 'Math', color: '#F59E0B', icon: '📐' },
  { id: 'english', name: '英语一', shortName: 'Eng', color: '#EC4899', icon: '📖' },
  { id: 'politics', name: '政治', shortName: 'Pol', color: '#F97316', icon: '🏛️' },
];

export const PHASES: PhaseInfo[] = [
  { id: 'foundation', name: '基础阶段', color: '#22C55E', startDate: '2026-05-28', endDate: '2026-06-30' },
  { id: 'reinforcement', name: '强化阶段', color: '#F59E0B', startDate: '2026-07-01', endDate: '2026-09-30' },
  { id: 'sprint', name: '冲刺阶段', color: '#EF4444', startDate: '2026-10-01', endDate: '2026-12-19' },
];

export const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map((s) => [s.id, s])) as Record<string, SubjectInfo>;

export const MOTIVATIONAL_QUOTES = [
  '你背不下来的书，总有人能背下来；你做不出来的题，总有人能做出来。',
  '考研不是因为有希望才坚持，而是因为坚持才有希望。',
  '今天流的口水，就是明天流的泪水。',
  '乾坤未定，你我皆是黑马。',
  '将来的你，一定会感谢现在拼命的自己。',
  '既然选择了远方，便只顾风雨兼程。',
  '最痛苦的不是失败，而是我本可以。',
  '那些你早起熬的夜，终会照亮你前行的路。',
  '累了就休息，但不要放弃。',
  '星辰不问赶路人，时光不负有心人。',
  '努力到无能为力，拼搏到感动自己。',
  '前路浩浩荡荡，万事尽可期待。',
  '纵有疾风起，人生不言弃。',
  '看似不起眼的日复一日，会在将来的某一天，突然让你看到坚持的意义。',
  '你所浪费的今天，是昨天死去的人奢望的明天。',
];

export const STORAGE_KEY = 'study-planner-state-v1';
