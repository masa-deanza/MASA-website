/**
 * Past Events Page View - Orchestrates archive filtering and page interactions
 */

import { $, $$ } from '../utils/dom.js';
import { initNavbar } from '../components/Navbar.js';

export function initPastEventsPage() {
  // Initialize shared navigation & drawer
  initNavbar();

  // Interactive filter tabs
  const filterBtns = $$('.filter-btn');
  const archiveCards = $$('.archive-card');

  if (filterBtns.length > 0 && archiveCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Toggle active class on buttons
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-filter') || 'all';

        // Filter cards using CSS classes
        archiveCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          
          // Reset classes
          card.classList.remove('is-hidden', 'fade-in-up');
          
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            // Force a reflow so the animation restarts
            void card.offsetWidth;
            card.classList.add('fade-in-up');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }
}
