/**
 * Main Application Entry Point
 * Malaysian & Singaporean Association (MASA) at De Anza College
 */

async function bootstrap() {
  const path = window.location.pathname;
  if (path.includes('past-events') || path.includes('past-events.html')) {
    const { initPastEventsPage } = await import('./pages/pastEvents.js');
    initPastEventsPage();
  } else if (path.includes('games') || path.includes('games.html')) {
    const { initGamesPage } = await import('./pages/games.js');
    initGamesPage();
  } else {
    const { initHomePage } = await import('./pages/home.js');
    initHomePage();
  }
}

// Initialize the application when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
