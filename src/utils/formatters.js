/**
 * Math, Animation & String Formatter Helpers
 */

/**
 * Quadratic ease-out easing calculation
 * @param {number} t - normalized time from 0 to 1
 * @returns {number}
 */
export const easeOutQuad = (t) => t * (2 - t);

/**
 * Format a number with optional suffix
 * @param {number} num
 * @param {string} [suffix='']
 * @returns {string}
 */
export const formatNumber = (num, suffix = '') => {
  return `${num.toLocaleString()}${suffix}`;
};

/**
 * Format date string into human readable format
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
