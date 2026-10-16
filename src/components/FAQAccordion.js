/**
 * FAQAccordion Component - Interactive FAQ expand/collapse
 */

import { $$ } from '../utils/dom.js';

export function initFAQAccordion() {
  const faqItems = $$('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach((item, index) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    const panelId = content.id || `faq-panel-${index + 1}`;
    const triggerId = trigger.id || `faq-trigger-${index + 1}`;
    content.id = panelId;
    trigger.id = triggerId;
    trigger.setAttribute('aria-controls', panelId);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', triggerId);
    content.setAttribute('aria-hidden', 'true');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherContent = otherItem.querySelector('.faq-content');
          otherTrigger?.setAttribute('aria-expanded', 'false');
          if (otherContent) {
            otherContent.style.maxHeight = null;
            otherContent.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
        content.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  // Update open FAQ item height on viewport resize so wrapped lines are never clipped
  window.addEventListener('resize', () => {
    faqItems.forEach(item => {
      if (item.classList.contains('open')) {
        const content = item.querySelector('.faq-content');
        if (content) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      }
    });
  });
}
