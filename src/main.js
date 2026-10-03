/**
 * Main Application Entry Point
 * Malaysian & Singaporean Association (MASA) at De Anza College
 */

import { initHomePage } from './pages/home.js';

// Initialize the application when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}
