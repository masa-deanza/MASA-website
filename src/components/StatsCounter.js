/**
 * StatsCounter Component - Animated live number counters
 */

import { $$ } from '../utils/dom.js';
import { easeOutQuad } from '../utils/formatters.js';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';

export function initStatsCounter() {
  const counters = $$('.counter');
  if (counters.length === 0) return;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target') || 0;
    const duration = 1600; // ms
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const countTimer = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const currentCount = Math.round(target * progress);

      if (frame <= totalFrames) {
        counter.textContent = currentCount;
      } else {
        counter.textContent = target;
        clearInterval(countTimer);
      }
    }, frameDuration);
  };

  useIntersectionObserver(counters, (entry, observer) => {
    animateCounter(entry.target);
    observer.unobserve(entry.target);
  }, { threshold: 0.3 });
}
