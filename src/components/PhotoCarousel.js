/**
 * PhotoCarousel Component - Hero Interactive Photo Gallery Carousel
 * Malaysian & Singaporean Association (MASA) at De Anza College
 */

import { $, $$ } from '../utils/dom.js';

export function initPhotoCarousel() {
  const carousel = $('.hero-carousel');
  if (!carousel) return;

  const track = $('.carousel-track', carousel);
  const slides = $$('.carousel-slide', carousel);
  const captions = $$('.carousel-caption-item', carousel);
  const dots = $$('.carousel-dot', carousel);
  const prevBtn = $('.carousel-arrow.prev', carousel);
  const nextBtn = $('.carousel-arrow.next', carousel);
  const currentCounter = $('#carouselCurrent', carousel);
  const totalCounter = $('#carouselTotal', carousel);

  if (slides.length === 0 || !track) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5000; // 5 seconds

  // Initialize total counter display
  if (totalCounter) {
    totalCounter.textContent = totalSlides;
  }

  // Handle image load & fallback for each slide
  slides.forEach((slide) => {
    const img = slide.querySelector('.carousel-img');
    const media = slide.querySelector('.slide-media');
    if (!img || !media) return;

    const checkImage = () => {
      const src = img.getAttribute('src');
      if (src && src.trim() !== '') {
        if (img.complete && img.naturalWidth > 0) {
          media.classList.add('has-image');
          img.style.display = 'block';
        }
      } else {
        media.classList.remove('has-image');
        img.style.display = 'none';
      }
    };

    img.addEventListener('load', () => {
      media.classList.add('has-image');
      img.style.display = 'block';
    });

    img.addEventListener('error', () => {
      media.classList.remove('has-image');
      img.style.display = 'none';
    });

    checkImage();
  });

  // Navigate to specific slide
  const goToSlide = (index) => {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Move carousel track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update slides accessibility and active states
    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', (!isActive).toString());
    });

    // Update caption items
    captions.forEach((cap, i) => {
      cap.classList.toggle('active', i === currentIndex);
    });

    // Update dots
    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update counter
    if (currentCounter) {
      currentCounter.textContent = currentIndex + 1;
    }
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  // Autoplay management
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const restartAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  // Button controls
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      restartAutoplay();
    });
  }

  // Dots controls
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const slideIndex = parseInt(dot.getAttribute('data-slide') || '0', 10);
      goToSlide(slideIndex);
      restartAutoplay();
    });
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      restartAutoplay();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      restartAutoplay();
    }
  });

  // Pause on hover or focus
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  // Pause when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwiping = false;

  carousel.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
      stopAutoplay();
    },
    { passive: true }
  );

  carousel.addEventListener(
    'touchend',
    (e) => {
      if (!isSwiping) return;
      isSwiping = false;

      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoplay();
    },
    { passive: true }
  );

  // Initial setup
  goToSlide(0);
  startAutoplay();
}
