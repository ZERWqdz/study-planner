# 408 Study Plan — AI 协作指南

考研 408 计算机统考学习规划追踪器，单页应用，React + Vite + TypeScript + Tailwind CSS + Framer Motion。

## 技术栈

- React 18 + TypeScript 5 + Vite 5
- Tailwind CSS 3 (CSS 变量驱动暗色/亮色主题)
- Framer Motion 10 (交互动画) + canvas-confetti (庆祝特效)
- Lucide React (SVG 图标) + date-fns (日期) + nanoid (ID 生成)

## 项目结构

```
src/
├── types/index.ts              # 所有 TS 类型 (Task, DayPlan, AppState, 等)
├── data/
│   ├── planGenerator.ts        # 计划生成引擎 (getFullPlan / getDynamicPlan)
│   ├── subjectContent.ts       # 科目每日任务模板
│   └── milestones.ts           # 里程碑、休息日、模拟考日期
├── utils/
│   ├── constants.ts            # PHASES, SUBJECTS, START_DATE, EXAM_DATE 等
│   ├── date.ts                 # 日期工具 (formatDate, addDaysToStr, getTodayStr, daysBetween)
│   └── storage.ts              # localStorage 读写 (loadState, saveState)
├── hooks/
│   ├── useStudyProgress.ts     # 学习统计计算 (StudyStats)
│   └── useMediaQuery.ts        # useIsMobile / useIsDesktop (768px / 1024px)
├── store/
│   └── studyStore.tsx           # StudyProvider + useStudy (Context + useReducer)
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         # 页面外壳, z-index 层级: bg < grid(z-1) < orbs(z-2) < content(z-10)
│   │   ├── Header.tsx           # 粘性顶栏 (GraduationCap 图标 + 日期 + 主题切换)
│   │   ├── BottomNav.tsx        # 移动端底部三标签导航 (layoutId 动画指示器)
│   │   └── BackgroundEffect.tsx # Canvas 粒子光效 (requestAnimationFrame 驱动, MutationObserver 监听主题)
│   ├── plan/
│   │   ├── PhaseSection.tsx     # 可折叠阶段面板 (默认展开当前阶段, 阶段色进度条)
│   │   ├── DayCard.tsx          # 可折叠日卡片 (今日默认展开, Framer Motion 动效)
│   │   └── TaskItem.tsx         # 单任务行 (Checkbox + 标题 + 类型/时长, carryOver 高亮)
│   ├── progress/
│   │   ├── ProgressRing.tsx     # SVG 圆环进度条
│   │   ├── StreakBadge.tsx      # 连续打卡徽章 (Flame 图标)
│   │   └── SubjectStats.tsx     # 7 科目进度条 (Lucide 图标)
│   ├── celebration/
│   │   ├── ConfettiEffect.tsx   # canvas-confetti 触发器
│   │   └── DailyCompleteModal.tsx # 今日完成弹窗 (Sparkles + 名言 + 统计)
│   └── ui/
│       ├── Checkbox.tsx         # 44px 触控区动画勾选框 (aria-pressed)
│       ├── Modal.tsx            # AnimatePresence 弹窗
│       └── Badge.tsx            # 通用徽章 (filled/outline)
└── pages/
    └── HomePage.tsx             # 主页面: 今日区 + 过滤栏 + 阶段列表 (max-w-5xl, 桌面3列)
```

## 命令

- `npm run dev` — 开发服务器 (localhost:5173, 热更新)
- `npm run build` — tsc 类型检查 + Vite 生产构建
- `npm run preview` — 预览生产构建

## 架构关键点

### 计划生成 & 动态再分配

- `getFullPlan()`: 静态生成 206 天完整计划，**内存缓存**（仅首次生成）
- `getDynamicPlan(completionMap)`: 读取 `completionMap`，收集历史未完成任务，打上 `carryOver: true` + `[补]` 前缀，均匀分配到今日及未来非休息日（每天最多 2 个）
- HomePage 使用 `getDynamicPlan(state.completionMap)` 作为 plan 来源，`completionMap` 变化时自动重算

### 状态管理

- `StudyProvider` (React Context) + `useReducer`
- State: `{ completionMap, theme, streak, lastActiveDate }`
- 每次 `TOGGLE_TASK` 调用 `saveState()` → localStorage
- `useStudy()` hook 暴露 `{ state, toggleTask, setTheme, isTodayComplete }`

### 持久化

- `loadState()` / `saveState()` 在 `storage.ts`
- Key: `study-planner-state-v1`
- 仅存储完成状态 + 主题偏好，计划数据实时生成
- 首次加载 `study-reset-v2` 标记清除旧数据（一次性从 5/28 重新开始）

### 主题系统

- `<html class="dark">` 默认暗色，`.light` 类切换亮色
- `:root` 定义暗色 CSS 变量，`.light` 覆盖亮色值
- body 使用 `var(--bg-primary)` / `var(--text-primary)` 确保切换生效
- `setTheme()` 同时更新 state + localStorage + `<html>` class
- BackgroundEffect 通过 MutationObserver 监听 class 变化自动换色

### Canvas 背景粒子

- 4 种粒子: 标准光点 (~120) + 萤火虫 (~25) + 闪烁微光 (~50) + 流星 (随机)
- `requestAnimationFrame` 驱动，`willChange: transform` GPU 加速
- 鼠标缓动跟随 (0.02 系数) + sin/cos 自主漂移
- 暗色模式: 白色/冷白粒子; 亮色模式: 灰色粒子

### 响应式

- `useIsMobile()`: < 768px
- `useIsDesktop()`: >= 1024px
- 移动端: 单列 + BottomNav (底部导航，layoutId 指示器动画)
- 桌面端: 三列网格 (HomePage) + 完整信息展示

## 设计原则

- **UIC 规范**: Precision Minimalism，无 emoji 图标 (全 Lucide SVG)，无 AI 感装饰
- **可访问性**: prefers-reduced-motion、focus-visible 焦点环、aria-label/pressed、44px 最小触控区
- **动效**: 150-250ms ease-out, `scaleX` 进度条 (GPU), 无 layout thrashing
- **卡片**: 无边框，6px 圆角，背景色差异区分层级
- **间距**: 4px/8px 递增体系，`mb-14` 大区块分隔
- **7 色科目**: DS=蓝 CO=红 OS=紫 CN=绿 Math=金 Eng=粉 Pol=橙

## 重要约束

- 永远使用中文回复用户
- 不要引入非必要的依赖或抽象
- 修改背景/主题时必须同时测试暗色和亮色模式
- 粒子特效使用 Canvas，不要用 DOM 节点（性能）
- 计划数据由生成器实时产出，不要直接修改 `_planCache`
- localStorage key 不可随意更改（会丢失用户数据）
