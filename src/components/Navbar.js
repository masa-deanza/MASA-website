/**
 * Navbar Component - Navigation header and mobile drawer logic
 */

import { $, $$ } from '../utils/dom.js';
import { useScroll } from '../hooks/useScroll.js';

export function initNavbar() {
  const header = $('#mainHeader');
  const burgerBtn = $('#burgerBtn');
  const drawerCloseBtn = $('#drawerCloseBtn');
  const mobileDrawer = $('#mobileDrawer');
  const drawerBackdrop = $('#drawerBackdrop');
  const drawerLinks = $$('.drawer-link');

  // Sticky header scroll effect
  if (header) {
    useScroll((isScrolled) => {
      if (isScrolled) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 30);
  }

  // Drawer functions
  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    drawerBackdrop?.classList.add('active');
    burgerBtn?.classList.add('toggle');
    burgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleKeydown);
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    drawerBackdrop?.classList.remove('active');
    burgerBtn?.classList.remove('toggle');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    document.removeEventListener('keydown', handleKeydown);
    burgerBtn?.focus(); // Return focus to trigger
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }

    if (e.key === 'Tab') {
      const focusableElements = mobileDrawer.querySelectorAll('a[href], button:not([disabled])');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}
