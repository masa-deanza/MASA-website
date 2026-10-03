/**
 * Main Application Entry Point
 * Malaysian & Singaporean Association (MASA) at De Anza College
 */

import { initHomePage } from './pages/home.js';
import { initPastEventsPage } from './pages/pastEvents.js';

function bootstrap() {
  const path = window.location.pathname;
  if (path.includes('past-events') || path.includes('past-events.html')) {
    initPastEventsPage();
  } else {
    initHomePage();
  }
}

// Initialize the application when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
