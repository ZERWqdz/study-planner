import { useEffect, useRef } from 'react';

// ========== 粒子类型 ==========

interface BaseParticle {
  x: number; y: number;
  baseX: number; baseY: number;
  speed: number; phase: number;
}

/** 标准光点 — 遍布全屏的发光小点 */
interface DotParticle extends BaseParticle {
  type: 'dot';
  size: number;
  brightness: number;
}

/** 萤火虫 — 大颗、缓慢、脉冲呼吸 */
interface Firefly extends BaseParticle {
  type: 'firefly';
  size: number;
  brightness: number;
  pulseSpeed: number;
}

/** 闪烁微光 — 极小、快速闪烁 */
interface Sparkle extends BaseParticle {
  type: 'sparkle';
  size: number;
  blinkSpeed: number;
}

/** 流星 — 偶尔划过 */
interface ShootingStar {
  type: 'shooting';
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  length: number;
}

type Particle = DotParticle | Firefly | Sparkle;
type AnyParticle = Particle | ShootingStar;

// ========== 主题颜色 ==========

interface ThemeColors {
  dot: string;
  firefly: string;
  sparkle: string;
  mouseGlow: string;
  star: string;
}

const DARK: ThemeColors = {
  dot: '255,255,255',
  firefly: '220,230,255',
  sparkle: '255,255,255',
  mouseGlow: '255,255,255',
  star: '255,255,255',
};

const LIGHT: ThemeColors = {
  dot: '80,80,90',
  firefly: '60,70,100',
  sparkle: '100,100,110',
  mouseGlow: '80,80,90',
  star: '60,60,70',
};

// ========== 组件 ==========

export function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let mouseX = 0.5, mouseY = 0.5, curX = 0.5, curY = 0.5;
    let particles: Particle[] = [];
    let shootingStars: ShootingStar[] = [];
    let width = 0, height = 0, dpr = 1;

    const isLight = () => document.documentElement.classList.contains('light');
    let colors = isLight() ? LIGHT : DARK;

    // --- 初始化 ---

    const initCanvas = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const createParticles = () => {
      particles = [];
      const area = width * height;

      // 标准光点 (~120)
      const dotCount = Math.floor(area / 15000);
      for (let i = 0; i < dotCount; i++) {
        particles.push({
          type: 'dot',
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          size: Math.random() * 1.8 + 0.5,
          brightness: Math.random() * 0.4 + 0.2,
          speed: Math.random() * 0.2 + 0.05,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // 萤火虫 (~25)
      const ffCount = Math.floor(area / 70000);
      for (let i = 0; i < ffCount; i++) {
        particles.push({
          type: 'firefly',
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          size: Math.random() * 3 + 2,
          brightness: Math.random() * 0.4 + 0.35,
          pulseSpeed: Math.random() * 1.5 + 0.8,
          speed: Math.random() * 0.12 + 0.03,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // 闪烁微光 (~50)
      const spCount = Math.floor(area / 35000);
      for (let i = 0; i < spCount; i++) {
        particles.push({
          type: 'sparkle',
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          size: Math.random() * 1.2 + 0.3,
          blinkSpeed: Math.random() * 4 + 2,
          speed: Math.random() * 0.15 + 0.04,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const spawnShootingStar = () => {
      const star: ShootingStar = {
        type: 'shooting',
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.5,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        length: Math.random() * 80 + 40,
      };
      shootingStars.push(star);
    };

    // --- 事件 ---

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / width;
      mouseY = e.clientY / height;
    };

    const observer = new MutationObserver(() => {
      colors = isLight() ? LIGHT : DARK;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // --- 渲染循环 ---

    let time = 0;
    let lastStarSpawn = 0;

    const animate = (now: number) => {
      time = now * 0.001;
      curX += (mouseX - curX) * 0.02;
      curY += (mouseY - curY) * 0.02;

      ctx.clearRect(0, 0, width, height);

      // 鼠标区域柔光
      const mx = curX * width;
      const my = curY * height;
      const mg = ctx.createRadialGradient(mx, my, 0, mx, my, 320);
      mg.addColorStop(0, `rgba(${colors.mouseGlow},0.025)`);
      mg.addColorStop(0.4, `rgba(${colors.mouseGlow},0.008)`);
      mg.addColorStop(1, 'transparent');
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, width, height);

      // 定时生成流星
      if (time - lastStarSpawn > 4 + Math.random() * 6) {
        spawnShootingStar();
        lastStarSpawn = time;
      }

      // 绘制标准光点
      for (const p of particles) {
        if (p.type !== 'dot') continue;
        updatePosition(p, time, curX, curY);
        drawGlow(ctx, p.x, p.y, p.size * 5, p.size, colors.dot, p.brightness);
      }

      // 绘制萤火虫（先画，让它们在底层）
      for (const p of particles) {
        if (p.type !== 'firefly') continue;
        updatePosition(p, time, curX, curY);
        const pulse = 0.6 + 0.4 * Math.sin(time * p.pulseSpeed + p.phase);
        const b = p.brightness * pulse;
        drawGlow(ctx, p.x, p.y, p.size * 7, p.size * 1.5, colors.firefly, b);
      }

      // 绘制闪烁微光
      for (const p of particles) {
        if (p.type !== 'sparkle') continue;
        updatePosition(p, time, curX, curY);
        const blink = Math.abs(Math.sin(time * p.blinkSpeed + p.phase));
        const b = blink > 0.7 ? blink : 0.1;
        drawGlow(ctx, p.x, p.y, p.size * 4, p.size * 0.6, colors.sparkle, b * 0.7);
      }

      // 绘制流星
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life++;
        if (s.life > s.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }
        const progress = s.life / s.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - progress;
        const sx = s.x + s.vx * s.life;
        const sy = s.y + s.vy * s.life;

        ctx.strokeStyle = `rgba(${colors.star},${alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - s.vx * s.length * 0.3, sy - s.vy * s.length * 0.3);
        ctx.stroke();

        // 头部光点
        const headG = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
        headG.addColorStop(0, `rgba(${colors.star},${alpha})`);
        headG.addColorStop(1, 'transparent');
        ctx.fillStyle = headG;
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      initCanvas();
      createParticles();
    };

    // --- 启动 ---
    initCanvas();
    createParticles();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    rafId = requestAnimationFrame(animate);
    lastStarSpawn = time;

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ background: 'transparent' }}
    />
  );
}

// ========== 工具函数 ==========

function updatePosition(
  p: { x: number; y: number; baseX: number; baseY: number; speed: number; phase: number },
  time: number,
  curX: number,
  curY: number,
) {
  const driftX = Math.sin(time * p.speed + p.phase) * 30;
  const driftY = Math.cos(time * p.speed * 1.3 + p.phase) * 30;
  const paraX = (curX - 0.5) * 22 * p.speed;
  const paraY = (curY - 0.5) * 22 * p.speed;
  p.x = p.baseX + driftX + paraX;
  p.y = p.baseY + driftY + paraY;
}

/** 绘制发光粒子：外层辉光 + 内层核心 */
function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  outerR: number, innerR: number,
  color: string, brightness: number,
) {
  // 外层辉光
  const og = ctx.createRadialGradient(x, y, 0, x, y, outerR);
  og.addColorStop(0, `rgba(${color},${brightness * 0.25})`);
  og.addColorStop(0.5, `rgba(${color},${brightness * 0.08})`);
  og.addColorStop(1, 'transparent');
  ctx.fillStyle = og;
  ctx.beginPath();
  ctx.arc(x, y, outerR, 0, Math.PI * 2);
  ctx.fill();

  // 内层核心
  const ig = ctx.createRadialGradient(x, y, 0, x, y, innerR);
  ig.addColorStop(0, `rgba(${color},${brightness * 1.0})`);
  ig.addColorStop(0.4, `rgba(${color},${brightness * 0.45})`);
  ig.addColorStop(1, 'transparent');
  ctx.fillStyle = ig;
  ctx.beginPath();
  ctx.arc(x, y, innerR, 0, Math.PI * 2);
  ctx.fill();
}
