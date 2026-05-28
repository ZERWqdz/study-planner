import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 一次性重置：清除旧记录从5/28重新开始
const RESET_FLAG = 'study-reset-v2';
if (!localStorage.getItem(RESET_FLAG)) {
  localStorage.removeItem('study-planner-state-v1');
  localStorage.setItem(RESET_FLAG, '1');
}

// 初始化主题
const stored = localStorage.getItem('study-planner-state-v1');
if (stored) {
  try {
    const state = JSON.parse(stored);
    if (state.theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  } catch {
    // ignore
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
