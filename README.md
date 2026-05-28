# 408 Study Plan

考研 408 计算机统考学习规划追踪器。206 天科学备考，三阶段递进，每日任务管理，进度可视化。

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-0055FF?logo=framer)

## Features

- **206 天完整计划** — 基础 / 强化 / 冲刺三阶段，自动生成每日学习任务
- **智能再分配** — 历史未完成任务自动分发到后续天数，确保总量完成
- **实时进度** — 总进度条、阶段进度条、分科目统计
- **暗色/亮色双主题** — CSS 变量驱动，一键切换
- **Canvas 粒子背景** — 光点、萤火虫、闪烁微光、流星四种粒子特效
- **localStorage 持久化** — 勾选状态停止重启不丢失
- **响应式布局** — 移动端单列 + 底部导航，桌面端三列网格
- **无障碍支持** — prefers-reduced-motion、focus-visible、aria 语义

## Tech Stack

| 类别 | 选型 |
|------|------|
| 框架 | React 18 + TypeScript 5 |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 + CSS Variables |
| 动效 | Framer Motion 10 + canvas-confetti |
| 图标 | Lucide React |
| 工具 | date-fns / nanoid |

## Quick Start

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:5173)
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## Project Structure

```
src/
├── types/index.ts              # TypeScript 类型定义
├── data/
│   ├── planGenerator.ts        # 206天计划生成 + 动态再分配引擎
│   ├── subjectContent.ts       # 各科目每日任务模板
│   └── milestones.ts           # 里程碑、休息日、模拟考
├── utils/
│   ├── constants.ts            # 阶段/科目/日期常量
│   ├── date.ts                 # 日期工具 (date-fns)
│   └── storage.ts              # localStorage 读写
├── hooks/
│   ├── useStudyProgress.ts     # 学习统计计算
│   └── useMediaQuery.ts        # 响应式断点检测
├── store/
│   └── studyStore.tsx           # React Context + useReducer
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         # 页面壳 (Header + Main + BottomNav)
│   │   ├── Header.tsx           # 顶部导航栏
│   │   ├── BottomNav.tsx        # 移动端底部导航
│   │   └── BackgroundEffect.tsx # Canvas 粒子背景特效
│   ├── plan/
│   │   ├── PhaseSection.tsx     # 可折叠阶段面板 + 进度条
│   │   ├── DayCard.tsx          # 可折叠日卡片
│   │   └── TaskItem.tsx         # 单条任务 (checkbox + 时间)
│   ├── progress/
│   │   ├── ProgressRing.tsx     # SVG 圆环进度
│   │   ├── StreakBadge.tsx      # 连续打卡徽章
│   │   └── SubjectStats.tsx     # 分科目进度条
│   ├── celebration/
│   │   ├── ConfettiEffect.tsx   # 庆祝彩纸特效
│   │   └── DailyCompleteModal.tsx # 每日完成弹窗
│   └── ui/
│       ├── Checkbox.tsx         # 动画勾选框
│       ├── Modal.tsx            # 通用弹窗
│       └── Badge.tsx            # 通用徽章
└── pages/
    └── HomePage.tsx             # 主页面 (今日任务 + 阶段列表)
```

## Design System

- **风格**: Precision Minimalism — Linear/Vercel 式克制美学
- **暗色模式**: `#0a0a0a` 底，`#f2f2f2` 字，无边框卡片
- **亮色模式**: `#fafafa` 底，`#0a0a0a` 字
- **字体**: Inter (英文) + Noto Sans SC (中文)
- **间距**: 4px/8px 递增体系
- **圆角**: 6px 统一
- **动效**: 150-250ms ease-out，尊重 prefers-reduced-motion

## Architecture

- **计划生成**: 规则引擎按日期/阶段/科目自动产出每日任务，首次生成后内存缓存
- **动态再分配**: `getDynamicPlan(completionMap)` 检测历史未完成任务，均匀分配到未来非休息日
- **持久化**: 仅 `completionMap` 存入 localStorage，计划数据实时生成
- **状态管理**: React Context + useReducer，`TOGGLE_TASK` 触发保存
- **主题切换**: `<html>` class `dark`/`light` → CSS 变量全量切换

## License

MIT
