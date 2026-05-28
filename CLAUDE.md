# 考研408学习规划网站

基于 React + Vite + TypeScript + Tailwind CSS + Framer Motion 构建的考研学习规划单页应用。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite 5
- **样式**: Tailwind CSS 3
- **动画**: Framer Motion 10 + canvas-confetti
- **工具**: date-fns, lucide-react, nanoid

## 项目结构

```
src/
├── types/          # TypeScript 类型定义
├── data/           # 学习计划数据生成引擎
├── utils/          # 工具函数（日期、存储、常量）
├── hooks/          # 自定义 hooks
├── store/          # React Context 全局状态
├── components/
│   ├── plan/       # 核心计划组件 (DayCard, TaskItem)
│   ├── progress/   # 进度组件 (ProgressRing, StreakBadge)
│   ├── celebration/# 庆祝动画 (ConfettiEffect, DailyCompleteModal)
│   ├── layout/     # 布局组件 (AppShell, Header, BottomNav)
│   └── ui/         # 基础 UI 组件 (Checkbox, Modal, Badge)
└── pages/          # 页面组件
```

## 命令

- `npm run dev` — 启动开发服务器（端口 5173）
- `npm run build` — TypeScript 检查 + 生产构建
- `npm run preview` — 预览生产构建

## 架构要点

- **计划生成**: `planGenerator.ts` 按规则引擎自动生成 206 天学习计划，使用内存缓存
- **持久化**: 仅存储任务完成状态到 localStorage（completionMap），计划数据由生成器实时产出
- **状态管理**: React Context + useReducer，避免 prop drilling
- **响应式**: useMediaQuery hook 驱动，768px/1024px 断点

## 设计原则

- 默认暗黑模式，CSS 变量驱动主题切换
- 7 色科目标签系统（每个科目固定颜色）
- Framer Motion spring 动画用于交互反馈
- 移动端适配：底部 TabBar 导航 + 单列布局
- 桌面端：三列网格 + 完整信息展示
