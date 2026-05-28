import type { DayPlan, Task, PhaseId, SubjectId } from '@/types';
import { nanoid } from 'nanoid';
import { formatDate, addDaysToStr, getTodayStr } from '@/utils/date';
import { START_DATE, EXAM_DATE } from '@/utils/constants';
import {
  getMathDailyTemplate,
  getEnglishDailyTemplate,
  getPoliticsDailyTemplate,
  FOUNDATION_CURRICULUM,
  REINFORCEMENT_CURRICULUM,
} from './subjectContent';
import { getPhaseForDate, isRestDay, isLightReviewDay, getMilestonesForDate } from './milestones';

function generateId(): string {
  return nanoid(8);
}

let _planCache: DayPlan[] | null = null;

export function getFullPlan(): DayPlan[] {
  if (_planCache) return _planCache;
  _planCache = generateStudyPlan();
  return _planCache;
}

export function clearPlanCache(): void {
  _planCache = null;
}

/**
 * 动态计划：根据完成状态，将历史未完成任务重新分配到今日及未来天数
 */
export function getDynamicPlan(completionMap: Record<string, string[]>): DayPlan[] {
  const basePlan = getFullPlan();
  const today = getTodayStr();

  // 1. 收集所有历史未完成任务
  const carryOver: Task[] = [];

  for (const day of basePlan) {
    if (day.date >= today) break;
    if (day.isRestDay) continue;
    const done = completionMap[day.date] ?? [];
    for (const task of day.tasks) {
      if (!done.includes(task.id)) {
        carryOver.push({
          ...task,
          id: generateId(),
          carryOver: true,
          title: `[补] ${task.title}`,
        });
      }
    }
  }

  if (carryOver.length === 0) return basePlan;

  // 2. 找到未来非休息日（从今天开始）
  const futureIndices: number[] = [];
  for (let i = 0; i < basePlan.length; i++) {
    if (basePlan[i].date >= today && !basePlan[i].isRestDay) {
      futureIndices.push(i);
    }
  }

  if (futureIndices.length === 0) return basePlan;

  // 3. 均匀分配补做任务，每天最多2个
  const maxPerDay = Math.min(2, Math.ceil(carryOver.length / futureIndices.length));
  let taskCursor = 0;

  const augmentedPlan = basePlan.map((day, idx) => {
    if (!futureIndices.includes(idx)) return day;
    if (taskCursor >= carryOver.length) return day;

    const slice = carryOver.slice(taskCursor, taskCursor + maxPerDay);
    taskCursor += maxPerDay;

    return {
      ...day,
      tasks: [...day.tasks, ...slice],
    };
  });

  return augmentedPlan;
}

export function getTodayPlan(): DayPlan {
  const today = formatDate(new Date());
  const plan = getFullPlan();
  const found = plan.find((d) => d.date === today);
  if (found) return found;
  // 如果今天不在计划范围内，返回一个空计划
  return {
    date: today,
    dayOfWeek: new Date().getDay(),
    phaseId: 'sprint',
    isRestDay: true,
    tasks: [],
    note: '今天不在考研计划范围内',
  };
}

export function getPlanForDate(dateStr: string): DayPlan | undefined {
  return getFullPlan().find((d) => d.date === dateStr);
}

function generateStudyPlan(): DayPlan[] {
  const days: DayPlan[] = [];
  let currentDate = START_DATE;

  // 408 课程进度追踪
  let foundation408Index = 0;
  let reinforcement408Index = 0;
  let sprintWeekCount = 0;
  let sprint408YearIndex = 2009; // 真题年份

  while (currentDate <= EXAM_DATE) {
    const phaseId = getPhaseForDate(currentDate);
    const dayOfWeek = new Date(currentDate + 'T00:00:00').getDay();
    const restDay = isRestDay(currentDate, phaseId);
    const milestones = getMilestonesForDate(currentDate);

    // 检查是否有模拟考试
    const hasMockExam = milestones.some((m) => m.type === 'mock-exam');

    if (restDay) {
      const restMilestone = milestones.find((m) => m.type === 'rest');
      days.push({
        date: currentDate,
        dayOfWeek,
        phaseId,
        isRestDay: true,
        tasks: [],
        note: restMilestone?.description ?? getRestDayNote(phaseId),
      });
    } else {
      const tasks = generateTasksForDay(
        currentDate,
        phaseId,
        dayOfWeek,
        ref => {
          if (phaseId === 'foundation') return foundation408Index + ref;
          if (phaseId === 'reinforcement') return reinforcement408Index + ref;
          return 0;
        },
        hasMockExam,
        sprintWeekCount,
        sprint408YearIndex,
      );

      // 更新408进度索引
      if (phaseId === 'foundation') {
        foundation408Index = (foundation408Index + 1) % (FOUNDATION_CURRICULUM.length * 2);
      } else if (phaseId === 'reinforcement') {
        reinforcement408Index = (reinforcement408Index + 1) % (REINFORCEMENT_CURRICULUM.length * 2);
      } else {
        sprintWeekCount++;
        if (sprintWeekCount % 2 === 0) sprint408YearIndex++;
        if (sprint408YearIndex > 2026) sprint408YearIndex = 2009;
      }

      const milestoneNote = milestones.find((m) => m.type === 'milestone' || m.type === 'note');
      const lightReview = isLightReviewDay(currentDate, phaseId);

      days.push({
        date: currentDate,
        dayOfWeek,
        phaseId,
        isRestDay: false,
        tasks: lightReview ? getLightReviewTasks(phaseId) : tasks,
        note: milestoneNote?.description ?? (lightReview ? '今天是轻量复习日，回顾本周所学内容，整理错题，查漏补缺。' : undefined),
      });
    }

    currentDate = addDaysToStr(currentDate, 1);
  }

  return days;
}

function generateTasksForDay(
  dateStr: string,
  phaseId: PhaseId,
  dayOfWeek: number,
  get408Index: (ref: number) => number,
  hasMockExam: boolean,
  sprintWeekCount: number,
  sprintYear: number,
): Task[] {
  const tasks: Task[] = [];

  // 数学
  const mathTemplate = getMathDailyTemplate(dateStr, phaseId);
  tasks.push(
    ...mathTemplate.tasks.map((t) => ({
      id: generateId(),
      subjectId: 'math' as SubjectId,
      title: t.title,
      taskType: t.taskType,
      estimatedMinutes: t.minutes,
    })),
  );

  // 英语
  const engTemplate = getEnglishDailyTemplate(dateStr, phaseId);
  tasks.push(
    ...engTemplate.tasks.map((t) => ({
      id: generateId(),
      subjectId: 'english' as SubjectId,
      title: t.title,
      taskType: t.taskType,
      estimatedMinutes: t.minutes,
    })),
  );

  // 政治（仅冲刺阶段）
  const polTemplate = getPoliticsDailyTemplate(dateStr, phaseId);
  if (polTemplate) {
    tasks.push(
      ...polTemplate.tasks.map((t) => ({
        id: generateId(),
        subjectId: 'politics' as SubjectId,
        title: t.title,
        taskType: t.taskType,
        estimatedMinutes: t.minutes,
      })),
    );
  }

  // 408专业课
  if (phaseId === 'foundation' || phaseId === 'reinforcement') {
    const curriculum = phaseId === 'foundation' ? FOUNDATION_CURRICULUM : REINFORCEMENT_CURRICULUM;

    // 每天安排2个408科目（交替）
    const idx1 = get408Index(0) % curriculum.length;
    const idx2 = (get408Index(0) + Math.floor(curriculum.length / 2)) % curriculum.length;

    const c1 = curriculum[idx1];
    const c2 = curriculum[idx2];

    if (c1) {
      tasks.push({
        id: generateId(),
        subjectId: c1.subjectId,
        title: `${c1.topic}（教材精读+笔记）`,
        taskType: 'textbook',
        estimatedMinutes: phaseId === 'foundation' ? 90 : 120,
      });
    }
    if (c2 && c2.subjectId !== c1.subjectId) {
      tasks.push({
        id: generateId(),
        subjectId: c2.subjectId,
        title: `${c2.topic}（教材精读+笔记）`,
        taskType: 'textbook',
        estimatedMinutes: phaseId === 'foundation' ? 60 : 90,
      });
    }
  } else {
    // 冲刺阶段408
    if (hasMockExam) {
      tasks.push({
        id: generateId(),
        subjectId: 'data-structure',
        title: `408 全真模拟考试 — ${sprintYear}年真题（3小时）`,
        taskType: 'mock-exam',
        estimatedMinutes: 180,
      });
      tasks.push({
        id: generateId(),
        subjectId: 'data-structure',
        title: '模拟考试复盘与错题分析',
        taskType: 'review',
        estimatedMinutes: 60,
      });
    } else {
      // 冲刺练习日：按科目轮换
      const sprint408subjects: SubjectId[] = [
        'data-structure',
        'computer-organization',
        'operating-system',
        'computer-network',
      ];
      const subj = sprint408subjects[sprintWeekCount % 4];
      tasks.push({
        id: generateId(),
        subjectId: subj,
        title: `${getSubjectName(subj)} 真题专项练习与查漏补缺`,
        taskType: 'exercise',
        estimatedMinutes: 120,
      });
    }
  }

  // 每日复习
  if (phaseId !== 'foundation') {
    tasks.push({
      id: generateId(),
      subjectId: 'math',
      title: '当日错题复盘与薄弱点强化',
      taskType: 'review',
      estimatedMinutes: phaseId === 'sprint' ? 90 : 60,
    });
  } else {
    tasks.push({
      id: generateId(),
      subjectId: 'math',
      title: '当日学习内容回顾与笔记整理',
      taskType: 'review',
      estimatedMinutes: 30,
    });
  }

  return tasks;
}

function getLightReviewTasks(phaseId: PhaseId): Task[] {
  return [
    { id: generateId(), subjectId: 'math', title: '本周数学错题全面复盘', taskType: 'review', estimatedMinutes: 60 },
    { id: generateId(), subjectId: 'english', title: '英语词汇复习 + 本周阅读回顾', taskType: 'review', estimatedMinutes: 45 },
    { id: generateId(), subjectId: 'data-structure', title: '本周408知识点梳理与错题整理', taskType: 'review', estimatedMinutes: 60 },
  ];
}

function getRestDayNote(phaseId: PhaseId): string {
  const notes: Record<PhaseId, string[]> = {
    foundation: [
      '适当休息，恢复精力。可以看一部电影或出门散步。',
      '休息是为了走更长远的路。今天放松一下！',
      '劳逸结合，让大脑适当放空。',
      '今天给自己充充电，明天效率翻倍！',
    ],
    reinforcement: [
      '强化阶段辛苦啦！今天好好休息，享受生活。',
      '给大脑放个假，出去运动或和朋友聊聊天。',
      '适度休息是高效学习的一部分。',
    ],
    sprint: [
      '冲刺阶段也需要休息！适当放松，保持最佳状态。',
      '最后冲刺，注意劳逸结合，不要过度疲劳。',
      '休息好才能考得好！今天放松一下吧。',
    ],
  };
  const pool = notes[phaseId];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getSubjectName(subjectId: SubjectId): string {
  const names: Record<SubjectId, string> = {
    'data-structure': '数据结构',
    'computer-organization': '计算机组成原理',
    'operating-system': '操作系统',
    'computer-network': '计算机网络',
    math: '数学一',
    english: '英语一',
    politics: '政治',
  };
  return names[subjectId];
}
