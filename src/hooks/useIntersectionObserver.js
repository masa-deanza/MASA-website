/**
 * useIntersectionObserver Hook - Viewport visibility observer
 */

/**
 * Observe elements entering or exiting viewport
 * @param {Element[]|NodeList} elements
 * @param {(entry: IntersectionObserverEntry, observer: IntersectionObserver) => void} onIntersect
 * @param {IntersectionObserverInit} [options={ threshold: 0.3 }]
 * @returns {IntersectionObserver|null}
 */
export function useIntersectionObserver(elements, onIntersect, options = { threshold: 0.3 }) {
  if (!elements || elements.length === 0 || !('IntersectionObserver' in window)) {
    return null;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onIntersect(entry, obs);
      }
    });
  }, options);

  elements.forEach(el => observer.observe(el));

  return observer;
}
