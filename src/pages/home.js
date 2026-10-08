/**
 * Home Page View - Orchestrates components and page-specific interactions
 */

import { $ } from '../utils/dom.js';
import { initNavbar } from '../components/Navbar.js';
import { initFAQAccordion } from '../components/FAQAccordion.js';
import { initPhotoCarousel } from '../components/PhotoCarousel.js';
import { submitContactMessage } from '../services/contactService.js';

export function initHomePage() {
  // Initialize shared components on the Home view
  initNavbar();
  initFAQAccordion();
  initPhotoCarousel();

  // Contact form handling
  const contactForm = $('#contactForm');
  const formStatus = $('#formStatus');
  const submitBtn = $('#submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitContactMessage(contactForm, formStatus, submitBtn);
    });
  }
}
