/**
 * MalaysiaMap Component — Interactive Officer Hometown Map
 * Malaysian & Singaporean Association (MASA) — De Anza College
 *
 * Interaction model:
 *  - Hovering / focusing an officer card → highlights their home state(s),
 *    activates the leader line, hometown pin, and card.
 *  - Hovering a state polygon or pin → activates connected officer card(s),
 *    leader lines, and pin.
 *  - Leaving any element → clears all highlights.
 *  - Dynamically recalculates leader line curves to connect pins directly to cards.
 */

// ---------------------------------------------------------------------------
// Officer → State mapping
// Keys = data-officer attribute values on .map-officer-card elements
// Values = array of SVG element IDs (id attr on <path> elements) to highlight
// ---------------------------------------------------------------------------
const OFFICER_STATE_MAP = {
  siangjun: ['penang'],
  gin:      ['penang'],
  weijin:   ['perak'],
  zehou:    ['kualalumpur', 'selangor'],
  rayson:   ['johor'],
  rachel:   ['singapore'],
  kingston: ['sabah'],
};

// ---------------------------------------------------------------------------
// Officer → Pin mapping
// Keys = data-officer attribute values
// Values = id of the <circle> pin element to activate
// ---------------------------------------------------------------------------
const OFFICER_PIN_MAP = {
  siangjun: 'pin-penang',
  gin:      'pin-penang',
  weijin:   'pin-perak',
  zehou:    'pin-kualalumpur',
  rayson:   'pin-johor',
  rachel:   'pin-singapore',
  kingston: 'pin-sabah',
};

// ---------------------------------------------------------------------------
// Build reverse lookup: state id → officer id(s)
// Used when a state polygon is hovered directly
// ---------------------------------------------------------------------------
const STATE_OFFICER_MAP = {};
Object.entries(OFFICER_STATE_MAP).forEach(([officerId, stateIds]) => {
  stateIds.forEach((sid) => {
    if (!STATE_OFFICER_MAP[sid]) STATE_OFFICER_MAP[sid] = [];
    STATE_OFFICER_MAP[sid].push(officerId);
  });
});

// ---------------------------------------------------------------------------
// Main init function
// ---------------------------------------------------------------------------
export function initMalaysiaMap() {
  const canvas = document.getElementById('mapCanvas');
  const svg = document.getElementById('malaysiaSvg');
  if (!canvas || !svg) return;

  const officerCards = canvas.querySelectorAll('.map-officer-card');
  const stateEls     = canvas.querySelectorAll('.map-state');
  const leaderLines  = canvas.querySelectorAll('.map-leader-line');
  const pins         = canvas.querySelectorAll('.map-pin');

  let expandedOfficerId = null;
  let animFrameId = null;

  // ---- Helpers ----

  /**
   * Run a smooth animation loop during card expand/collapse transitions
   * so leader lines fluidly track the card boundary
   */
  function runLeaderLineAnimation(durationMs = 300) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    const start = performance.now();
    function tick(now) {
      updateLeaderLines();
      if (now - start < durationMs) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        updateLeaderLines();
        animFrameId = null;
      }
    }
    animFrameId = requestAnimationFrame(tick);
  }

  /** Remove active classes (preserves highlight if a card is currently expanded) */
  function clearAll() {
    if (expandedOfficerId) {
      activateOfficer(expandedOfficerId);
      return;
    }
    officerCards.forEach((c) => c.classList.remove('map-officer-card--active'));
    stateEls.forEach((s)     => s.classList.remove('map-state--active'));
    leaderLines.forEach((l)  => l.classList.remove('map-leader-line--active'));
    pins.forEach((p)         => p.classList.remove('map-pin--active'));
  }

  /**
   * Activate an officer:
   *  - Highlights their home state(s)
   *  - Highlights their leader line
   *  - Highlights their hometown pin
   *  - Activates their card
   * @param {string} officerId — matches data-officer attribute
   */
  function activateOfficer(officerId) {
    // Clear all elements first
    officerCards.forEach((c) => c.classList.remove('map-officer-card--active'));
    stateEls.forEach((s)     => s.classList.remove('map-state--active'));
    leaderLines.forEach((l)  => l.classList.remove('map-leader-line--active'));
    pins.forEach((p)         => p.classList.remove('map-pin--active'));

    // Highlight state polygons
    const stateIds = OFFICER_STATE_MAP[officerId] ?? [];
    stateIds.forEach((sid) => {
      document.getElementById(sid)?.classList.add('map-state--active');
    });

    // Highlight officer card
    canvas
      .querySelector(`[data-officer="${officerId}"]`)
      ?.classList.add('map-officer-card--active');

    // Highlight leader line
    canvas
      .querySelector(`#line-${officerId}`)
      ?.classList.add('map-leader-line--active');

    // Highlight pin
    const pinId = OFFICER_PIN_MAP[officerId];
    if (pinId) {
      document.getElementById(pinId)?.classList.add('map-pin--active');
    }
  }

  /**
   * Expand an officer card to show enlarged portrait, major, and bio
   * @param {string} officerId
   */
  function expandOfficer(officerId) {
    if (expandedOfficerId === officerId) return;

    // Reset previous expanded card if any
    officerCards.forEach((c) => {
      c.classList.remove('map-officer-card--expanded');
      c.setAttribute('aria-expanded', 'false');
    });

    expandedOfficerId = officerId;
    canvas.classList.add('has-expanded-card');

    const card = canvas.querySelector(`[data-officer="${officerId}"]`);
    if (card) {
      card.classList.add('map-officer-card--expanded');
      card.setAttribute('aria-expanded', 'true');
    }

    activateOfficer(officerId);
    runLeaderLineAnimation(320);
  }

  /**
   * Collapse the currently expanded card back to compact view
   */
  function collapseOfficer() {
    if (!expandedOfficerId) return;

    officerCards.forEach((c) => {
      c.classList.remove('map-officer-card--expanded');
      c.setAttribute('aria-expanded', 'false');
    });
    canvas.classList.remove('has-expanded-card');
    expandedOfficerId = null;

    clearAll();
    runLeaderLineAnimation(320);
  }

  /**
   * Activate all officers and elements connected to a state
   * @param {string} stateId
   */
  function activateState(stateId) {
    clearAll();
    document.getElementById(stateId)?.classList.add('map-state--active');

    const officerIds = STATE_OFFICER_MAP[stateId] ?? [];
    officerIds.forEach((oid) => {
      canvas
        .querySelector(`[data-officer="${oid}"]`)
        ?.classList.add('map-officer-card--active');
      canvas
        .querySelector(`#line-${oid}`)
        ?.classList.add('map-leader-line--active');
      const pinId = OFFICER_PIN_MAP[oid];
      if (pinId) {
        document.getElementById(pinId)?.classList.add('map-pin--active');
      }
    });
  }

  // ---- Card event listeners ----
  officerCards.forEach((card) => {
    const id = card.dataset.officer;
    if (!id) return;

    // Close button
    const closeBtn = card.querySelector('.map-officer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        collapseOfficer();
      });
    }

    card.addEventListener('mouseenter', () => {
      if (!expandedOfficerId) activateOfficer(id);
    });

    card.addEventListener('focus', () => {
      if (!expandedOfficerId) activateOfficer(id);
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.map-officer-close')) return;
      if (expandedOfficerId === id) return;
      expandOfficer(id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (expandedOfficerId === id) {
          collapseOfficer();
        } else {
          expandOfficer(id);
        }
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!expandedOfficerId) clearAll();
    });

    card.addEventListener('blur', () => {
      if (!expandedOfficerId) clearAll();
    });
  });

  // ---- State polygon event listeners ----
  stateEls.forEach((state) => {
    const stateId = state.id;
    state.addEventListener('mouseenter', () => {
      if (!expandedOfficerId) activateState(stateId);
    });
    state.addEventListener('click', () => {
      const officerIds = STATE_OFFICER_MAP[stateId] ?? [];
      if (officerIds.length === 1) {
        expandOfficer(officerIds[0]);
      } else {
        activateState(stateId);
      }
    });
    state.addEventListener('mouseleave', () => {
      if (!expandedOfficerId) clearAll();
    });
  });

  // ---- Pin event listeners ----
  pins.forEach((pin) => {
    const pinId = pin.id;
    const stateId = pinId.replace('pin-', '');
    pin.addEventListener('mouseenter', () => {
      if (!expandedOfficerId) activateState(stateId);
    });
    pin.addEventListener('click', () => {
      const officerIds = STATE_OFFICER_MAP[stateId] ?? [];
      if (officerIds.length === 1) {
        expandOfficer(officerIds[0]);
      } else {
        activateState(stateId);
      }
    });
    pin.addEventListener('mouseleave', () => {
      if (!expandedOfficerId) clearAll();
    });
  });

  // Click outside to collapse expanded card
  document.addEventListener('click', (e) => {
    if (expandedOfficerId && !e.target.closest('.map-officer-card') && !e.target.closest('.map-pin') && !e.target.closest('.map-state')) {
      collapseOfficer();
    }
  });

  /**
   * Dynamically calculate and update leader lines so that every line
   * connects with sub-pixel precision directly from its pin to the card's boundary
   */
  function updateLeaderLines() {
    const svgRect = svg.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) return;

    const vb = svg.viewBox.baseVal;
    const vbWidth = vb.width || 1200;
    const vbHeight = vb.height || 640;

    const scaleX = vbWidth / svgRect.width;
    const scaleY = vbHeight / svgRect.height;

    officerCards.forEach((card) => {
      const officerId = card.dataset.officer;
      const line = svg.querySelector(`#line-${officerId}`);
      const pinId = OFFICER_PIN_MAP[officerId];
      const pin = document.getElementById(pinId);
      if (!line || !pin) return;

      const pinCx = parseFloat(pin.getAttribute('cx'));
      const pinCy = parseFloat(pin.getAttribute('cy'));

      const cardRect = card.getBoundingClientRect();

      // Card coordinates precisely mapped into SVG coordinates
      const cardRight = (cardRect.right - svgRect.left) * scaleX;
      const cardLeft = (cardRect.left - svgRect.left) * scaleX;
      const cardCenterX = (cardRect.left + cardRect.width / 2 - svgRect.left) * scaleX;
      const cardCenterY = (cardRect.top + cardRect.height / 2 - svgRect.top) * scaleY;
      const cardTop = (cardRect.top - svgRect.top) * scaleY;

      let targetX, targetY, cp1x, cp1y, cp2x, cp2y;

      if (officerId === 'kingston') {
        // Kingston card at top right of Sabah -> connect to card's left-center edge
        targetX = cardLeft;
        targetY = cardCenterY;
        const dx = targetX - pinCx;
        cp1x = pinCx + dx * 0.4;
        cp1y = pinCy - 20;
        cp2x = targetX - dx * 0.4;
        cp2y = targetY;
      } else if (officerId === 'rayson' || officerId === 'rachel') {
        // Bottom cards -> connect to card's top-center edge
        targetX = cardCenterX;
        targetY = cardTop;
        const dy = targetY - pinCy;
        const dx = targetX - pinCx;
        cp1x = pinCx + dx * 0.2;
        cp1y = pinCy + dy * 0.45;
        cp2x = targetX - dx * 0.2;
        cp2y = targetY - dy * 0.45;
      } else {
        // Left cards (siangjun, gin, weijin, zehou) -> connect to card's right-center edge
        targetX = cardRight;
        targetY = cardCenterY;
        const dx = pinCx - targetX;
        cp1x = pinCx - dx * 0.4;
        cp1y = pinCy;
        cp2x = targetX + dx * 0.4;
        cp2y = targetY;
      }

      line.setAttribute(
        'd',
        `M ${pinCx.toFixed(1)},${pinCy.toFixed(1)} C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${targetX.toFixed(1)},${targetY.toFixed(1)}`
      );
    });
  }

  // Initial calculation + event triggers
  updateLeaderLines();
  window.addEventListener('resize', updateLeaderLines);
  window.addEventListener('load', updateLeaderLines);
  if (document.fonts) {
    document.fonts.ready.then(updateLeaderLines);
  }

  // Keyboard: Escape collapses expanded card or clears highlights
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (expandedOfficerId) {
        collapseOfficer();
      } else {
        clearAll();
      }
    }
  });
}
