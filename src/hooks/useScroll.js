/**
 * useScroll Hook - Custom scroll listener & threshold state
 */

/**
 * Attaches a passive scroll listener to window
 * @param {(isScrolled: boolean, scrollY: number) => void} callback
 * @param {number} [threshold=30]
 * @returns {() => void} Cleanup function to remove listener
 */
export function useScroll(callback, threshold = 30) {
  const handler = () => {
    const isScrolled = window.scrollY > threshold;
    callback(isScrolled, window.scrollY);
  };

  window.addEventListener('scroll', handler, { passive: true });
  // Initial check
  handler();

  return () => {
    window.removeEventListener('scroll', handler);
  };
}
