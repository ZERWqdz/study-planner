import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  fire: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ fire, onComplete }: ConfettiEffectProps) {
  const trigger = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#F59E0B', '#22C55E', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#F59E0B', '#22C55E', '#3B82F6', '#EC4899', '#8B5CF6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    };

    // 初始爆发
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.5, x: 0.5 },
      colors: ['#F59E0B', '#22C55E', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316', '#10B981'],
    });

    frame();
  }, [onComplete]);

  useEffect(() => {
    if (fire) {
      trigger();
    }
  }, [fire, trigger]);

  return null;
}
