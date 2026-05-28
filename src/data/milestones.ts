import type { PhaseId } from '@/types';

export interface Milestone {
  date: string;
  title: string;
  description: string;
  type: 'rest' | 'mock-exam' | 'milestone' | 'note';
}

export const MILESTONES: Milestone[] = [
  // 法定节假日休息
  { date: '2026-06-19', title: '端午节休息', description: '今天是端午节，给自己放个完整的假吧！吃粽子，放松身心。', type: 'rest' },
  { date: '2026-10-01', title: '国庆假期', description: '国庆第一天，冲刺前的休息。', type: 'rest' },
  { date: '2026-10-02', title: '国庆假期', description: '享受假期，调整状态。', type: 'rest' },
  { date: '2026-10-03', title: '国庆假期', description: '假期最后一天，明天开始冲刺！', type: 'rest' },
  { date: '2026-09-15', title: '中秋节休息', description: '中秋月圆，心想事成。花好月圆人团圆，考研必上岸！', type: 'rest' },

  // 模拟考试节点
  { date: '2026-09-15', title: '408全真模拟考试（一）', description: '第一次全套408真题模拟，检验强化阶段成果', type: 'mock-exam' },
  { date: '2026-10-15', title: '408全真模拟考试（二）', description: '第二次全真模拟，查找薄弱环节', type: 'mock-exam' },
  { date: '2026-11-01', title: '408全真模拟考试（三）', description: '第三次全真模拟，冲刺阶段自我检测', type: 'mock-exam' },
  { date: '2026-11-15', title: '408全真模拟考试（四）', description: '第四次全真模拟，查漏补缺', type: 'mock-exam' },
  { date: '2026-12-01', title: '408全真模拟考试（五）', description: '考前最后一次全真模拟，保持手感', type: 'mock-exam' },
  { date: '2026-10-10', title: '数学全真模拟考试（一）', description: '数学一真题模拟', type: 'mock-exam' },
  { date: '2026-11-10', title: '数学全真模拟考试（二）', description: '数学一真题模拟', type: 'mock-exam' },
  { date: '2026-10-20', title: '英语全真模拟考试（一）', description: '英语一真题模拟', type: 'mock-exam' },
  { date: '2026-11-20', title: '英语全真模拟考试（二）', description: '英语一真题模拟', type: 'mock-exam' },

  // 里程碑
  { date: '2026-06-30', title: '基础阶段结束', description: '回顾这一个月的收获，整理知识框架', type: 'milestone' },
  { date: '2026-09-30', title: '强化阶段结束', description: '你已经完成最艰苦的阶段，准备冲刺吧！', type: 'milestone' },
  { date: '2026-12-18', title: '考研倒计时1天', description: '轻量复习，保持手感，检查考试用品', type: 'note' },
  { date: '2026-12-19', title: '考研倒计时0天！', description: '沉着冷静，发挥出最好的水平！你准备好了！', type: 'note' },
];

export function getPhaseForDate(dateStr: string): PhaseId {
  if (dateStr <= '2026-06-30') return 'foundation';
  if (dateStr <= '2026-09-30') return 'reinforcement';
  return 'sprint';
}

export function isRestDay(dateStr: string, phaseId: PhaseId): boolean {
  // 检查是否为里程碑中指定的休息日
  const milestone = MILESTONES.find((m) => m.date === dateStr && m.type === 'rest');
  if (milestone) return true;

  const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay(); // 0=Sun
  const isSunday = dayOfWeek === 0;

  // 冲刺阶段最后两周调整为学5休2（周日+周六）
  if (dateStr >= '2026-12-05') {
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  // 默认：周日休息
  return isSunday;
}

export function isLightReviewDay(dateStr: string, phaseId: PhaseId): boolean {
  if (phaseId !== 'reinforcement') return false;
  const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay();
  return dayOfWeek === 6; // 强化阶段的周六为轻量复习日
}

export function getMilestonesForDate(dateStr: string): Milestone[] {
  return MILESTONES.filter((m) => m.date === dateStr);
}
