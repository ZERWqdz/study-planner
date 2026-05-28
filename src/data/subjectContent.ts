import type { SubjectId, PhaseId } from '@/types';

export interface ChapterContent {
  subjectId: SubjectId;
  topic: string;
  days: number;
  phaseId: PhaseId;
}

// 基础阶段：第一轮教材通读
export const FOUNDATION_CURRICULUM: ChapterContent[] = [
  // 数据结构 - 10天
  { subjectId: 'data-structure', topic: '绪论与算法复杂度分析', days: 1, phaseId: 'foundation' },
  { subjectId: 'data-structure', topic: '线性表的顺序存储与链式存储', days: 2, phaseId: 'foundation' },
  { subjectId: 'data-structure', topic: '栈和队列及其应用', days: 1, phaseId: 'foundation' },
  { subjectId: 'data-structure', topic: '串与模式匹配算法（KMP）', days: 1, phaseId: 'foundation' },
  { subjectId: 'data-structure', topic: '树与二叉树的概念、遍历与线索二叉树', days: 2, phaseId: 'foundation' },
  { subjectId: 'data-structure', topic: '图的概念、存储、遍历与最小生成树', days: 2, phaseId: 'foundation' },
  { subjectId: 'data-structure', topic: '查找：顺序、折半、散列表', days: 1, phaseId: 'foundation' },
  // 计组 - 9天
  { subjectId: 'computer-organization', topic: '计算机系统概述与发展', days: 1, phaseId: 'foundation' },
  { subjectId: 'computer-organization', topic: '数据的表示与运算（定点数、浮点数）', days: 2, phaseId: 'foundation' },
  { subjectId: 'computer-organization', topic: '运算器与ALU设计', days: 1, phaseId: 'foundation' },
  { subjectId: 'computer-organization', topic: '存储器层次结构（Cache、主存、虚拟存储）', days: 3, phaseId: 'foundation' },
  { subjectId: 'computer-organization', topic: '指令系统与CISC/RISC', days: 2, phaseId: 'foundation' },
  // 操作系统 - 7天
  { subjectId: 'operating-system', topic: '操作系统概述与结构', days: 1, phaseId: 'foundation' },
  { subjectId: 'operating-system', topic: '进程概念、状态转换与PCB', days: 1, phaseId: 'foundation' },
  { subjectId: 'operating-system', topic: '进程同步：信号量、管程、经典同步问题', days: 2, phaseId: 'foundation' },
  { subjectId: 'operating-system', topic: '处理机调度与死锁', days: 2, phaseId: 'foundation' },
  { subjectId: 'operating-system', topic: '内存管理：分页、分段、段页式、虚拟内存', days: 1, phaseId: 'foundation' },
  // 计算机网络 - 6天
  { subjectId: 'computer-network', topic: '计算机网络概述与分层体系结构', days: 1, phaseId: 'foundation' },
  { subjectId: 'computer-network', topic: '物理层：传输介质、编码与调制', days: 1, phaseId: 'foundation' },
  { subjectId: 'computer-network', topic: '数据链路层：帧定界、差错控制、CSMA/CD', days: 2, phaseId: 'foundation' },
  { subjectId: 'computer-network', topic: '数据链路层：PPP协议、交换机与VLAN', days: 2, phaseId: 'foundation' },
];

// 强化阶段：第二轮深入+刷题
export const REINFORCEMENT_CURRICULUM: ChapterContent[] = [
  { subjectId: 'data-structure', topic: '树与二叉树算法题专项训练', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'data-structure', topic: '图算法专项：最短路径、拓扑排序、关键路径', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'data-structure', topic: '查找与排序算法深入及大题突破', days: 4, phaseId: 'reinforcement' },
  { subjectId: 'data-structure', topic: '数据结构综合大题实战', days: 5, phaseId: 'reinforcement' },
  { subjectId: 'computer-organization', topic: '数据运算与ALU综合题', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'computer-organization', topic: 'Cache与虚拟存储器深入', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'computer-organization', topic: 'CPU数据通路与控制器设计', days: 4, phaseId: 'reinforcement' },
  { subjectId: 'computer-organization', topic: '总线与I/O系统', days: 4, phaseId: 'reinforcement' },
  { subjectId: 'operating-system', topic: '进程同步大题精讲', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'operating-system', topic: '内存管理与虚拟内存大题精讲', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'operating-system', topic: '文件系统与磁盘调度算法', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'operating-system', topic: 'I/O管理、SPOOLing技术', days: 2, phaseId: 'reinforcement' },
  { subjectId: 'operating-system', topic: '操作系统综合大题实战', days: 2, phaseId: 'reinforcement' },
  { subjectId: 'computer-network', topic: '数据链路层深入：滑动窗口、ARQ协议', days: 3, phaseId: 'reinforcement' },
  { subjectId: 'computer-network', topic: '网络层：IP、路由算法、ICMP、ARP', days: 4, phaseId: 'reinforcement' },
  { subjectId: 'computer-network', topic: '传输层：TCP/UDP、拥塞控制、流量控制', days: 4, phaseId: 'reinforcement' },
  { subjectId: 'computer-network', topic: '应用层：HTTP、DNS、SMTP等协议', days: 3, phaseId: 'reinforcement' },
  // 跨科综合
  { subjectId: 'data-structure', topic: '408四科交叉真题练习（小题专项）', days: 6, phaseId: 'reinforcement' },
  { subjectId: 'computer-organization', topic: '408四科交叉真题练习（大题专项）', days: 6, phaseId: 'reinforcement' },
];

// 各科每日任务模板
interface DailyTemplate {
  subjectId: SubjectId;
  tasks: { title: string; taskType: 'textbook' | 'video-lecture' | 'exercise' | 'review' | 'memorize' | 'mock-exam'; minutes: number }[];
}

export function getMathDailyTemplate(_dateStr: string, phaseId: PhaseId): DailyTemplate {
  switch (phaseId) {
    case 'foundation':
      return {
        subjectId: 'math',
        tasks: [
          { title: '高数教材精读与笔记', taskType: 'textbook', minutes: 60 },
          { title: '数学基础练习题', taskType: 'exercise', minutes: 30 },
        ],
      };
    case 'reinforcement':
      return {
        subjectId: 'math',
        tasks: [
          { title: '数学专题训练（线代/概率）', taskType: 'exercise', minutes: 75 },
          { title: '错题复盘与整理', taskType: 'review', minutes: 45 },
        ],
      };
    case 'sprint':
      return {
        subjectId: 'math',
        tasks: [
          { title: '数学真题/模拟题训练', taskType: 'mock-exam', minutes: 120 },
          { title: '数学错题二刷', taskType: 'review', minutes: 30 },
        ],
      };
  }
}

export function getEnglishDailyTemplate(_dateStr: string, phaseId: PhaseId): DailyTemplate {
  switch (phaseId) {
    case 'foundation':
      return {
        subjectId: 'english',
        tasks: [
          { title: '考研核心词汇背诵（200词）', taskType: 'memorize', minutes: 30 },
          { title: '长难句分析与翻译练习', taskType: 'exercise', minutes: 30 },
        ],
      };
    case 'reinforcement':
      return {
        subjectId: 'english',
        tasks: [
          { title: '英语阅读理解精练（2篇）', taskType: 'exercise', minutes: 45 },
          { title: '英语翻译专项训练', taskType: 'exercise', minutes: 15 },
        ],
      };
    case 'sprint':
      return {
        subjectId: 'english',
        tasks: [
          { title: '英语作文模板背诵与默写', taskType: 'memorize', minutes: 30 },
          { title: '完形填空与新题型练习', taskType: 'exercise', minutes: 30 },
        ],
      };
  }
}

export function getPoliticsDailyTemplate(_dateStr: string, phaseId: PhaseId): DailyTemplate | null {
  if (phaseId === 'sprint') {
    return {
      subjectId: 'politics',
      tasks: [
        { title: '政治选择题专项训练', taskType: 'exercise', minutes: 45 },
        { title: '政治大题知识点背诵', taskType: 'memorize', minutes: 30 },
      ],
    };
  }
  return null; // 基础和强化阶段不安排政治
}

export function get408DailyTopics(
  dateStr: string,
  phaseId: PhaseId,
  curriculumIndex: number,
): { subjectId: SubjectId; topic: string } | null {
  const curriculum = phaseId === 'foundation' ? FOUNDATION_CURRICULUM : REINFORCEMENT_CURRICULUM;
  if (curriculumIndex >= curriculum.length) return null;
  return {
    subjectId: curriculum[curriculumIndex].subjectId,
    topic: curriculum[curriculumIndex].topic,
  };
}
