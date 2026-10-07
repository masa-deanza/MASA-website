/**
 * Games Page - Interactive MASA Casino Lounge & Blackjack 21 Game
 */

import { $, $$ } from '../utils/dom.js';
import { initNavbar } from '../components/Navbar.js';

// --- Card Constants ---
const SUITS = [
  { name: 'spades', symbol: '♠', color: 'black' },
  { name: 'hearts', symbol: '♥', color: 'red' },
  { name: 'diamonds', symbol: '♦', color: 'red' },
  { name: 'clubs', symbol: '♣', color: 'black' }
];

const RANKS = [
  { rank: 'A', value: 11 },
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 10 },
  { rank: 'Q', value: 10 },
  { rank: 'K', value: 10 }
];

export function initGamesPage() {
  initNavbar();

  // --- Sound Effects via Web Audio API ---
  let audioCtx = null;
  let isMuted = localStorage.getItem('masa_blackjack_sound_muted') === 'true';

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.12, gainLevel = 0.15) {
    if (isMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  const playChipSound = () => playTone(880, 'triangle', 0.08, 0.12);
  const playCardSound = () => playTone(540, 'sine', 0.09, 0.1);
  const playWinSound = () => {
    playTone(523.25, 'triangle', 0.15, 0.2); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.2), 120); // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.25), 240); // G5
  };
  const playBlackjackSound = () => {
    playTone(523.25, 'triangle', 0.1, 0.25);
    setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.25), 100);
    setTimeout(() => playTone(783.99, 'triangle', 0.1, 0.25), 200);
    setTimeout(() => playTone(1046.50, 'triangle', 0.35, 0.3), 300); // C6
  };
  const playBustSound = () => {
    playTone(260, 'sawtooth', 0.2, 0.2);
    setTimeout(() => playTone(180, 'sawtooth', 0.3, 0.2), 150);
  };

  // --- Persistent Storage State ---
  let bankroll = parseInt(localStorage.getItem('masa_blackjack_bankroll'), 10);
  if (isNaN(bankroll) || bankroll < 0) {
    bankroll = 1000;
  }

  let lastBet = parseInt(localStorage.getItem('masa_blackjack_last_bet'), 10);
  if (isNaN(lastBet) || lastBet < 0) {
    lastBet = 0;
  }

  let stats = {
    played: 0,
    won: 0,
    lost: 0,
    pushed: 0,
    streak: 0,
    bestStreak: 0
  };

  try {
    const savedStats = JSON.parse(localStorage.getItem('masa_blackjack_stats'));
    if (savedStats && typeof savedStats.played === 'number') {
      stats = savedStats;
    }
  } catch (e) {
    // Keep default
  }

  function saveGameData() {
    localStorage.setItem('masa_blackjack_bankroll', bankroll.toString());
    localStorage.setItem('masa_blackjack_last_bet', lastBet.toString());
    localStorage.setItem('masa_blackjack_stats', JSON.stringify(stats));
  }

  // --- Game Engine Variables ---
  let deck = [];
  let playerHand = [];
  let dealerHand = [];
  let currentBet = 0;
  let isDoubled = false;
  let gameState = 'betting'; // 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn'

  // --- DOM Elements ---
  const bankrollEl = $('#bankrollDisplay');
  const betDisplayEl = $('#currentBetDisplay');
  const betCircleEl = $('#betCircle');
  const statusMessageEl = $('#tableStatusMessage');
  const dealerCardsEl = $('#dealerCards');
  const playerCardsEl = $('#playerCards');
  const dealerScoreEl = $('#dealerScore');
  const playerScoreEl = $('#playerScore');

  const dealBtn = $('#btnDeal');
  const hitBtn = $('#btnHit');
  const standBtn = $('#btnStand');
  const doubleBtn = $('#btnDouble');
  const clearBetBtn = $('#btnClearBet');
  const rebetBtn = $('#btnRebet');
  const doubleBetBtn = $('#btnDoubleBet');
  const allInBtn = $('#btnAllIn');
  const soundToggleBtn = $('#btnSoundToggle');
  const reloadChipsBtn = $('#btnReloadChips');

  // Stats DOM
  const statHandsEl = $('#statHands');
  const statWonEl = $('#statWon');
  const statLostEl = $('#statLost');
  const statWinRateEl = $('#statWinRate');
  const statStreakEl = $('#statStreak');

  // --- Deck Helpers ---
  function createDeck(numDecks = 4) {
    const newDeck = [];
    for (let d = 0; d < numDecks; d++) {
      for (const suit of SUITS) {
        for (const r of RANKS) {
          newDeck.push({
            rank: r.rank,
            value: r.value,
            suit: suit.symbol,
            suitName: suit.name,
            color: suit.color
          });
        }
      }
    }
    // Fisher-Yates Shuffle
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  }

  function drawCard() {
    if (deck.length < 15) {
      deck = createDeck(4);
    }
    return deck.pop();
  }

  // Calculate hand score (handles multiple Aces)
  function calculateHandScore(hand) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        score += 11;
      } else {
        score += card.value;
      }
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  }

  function isBlackjack(hand) {
    return hand.length === 2 && calculateHandScore(hand) === 21;
  }

  // --- Render Helpers ---
  function renderCard(card, isHidden = false) {
    const cardEl = document.createElement('div');
    if (isHidden) {
      cardEl.className = 'card-item card-back';
      cardEl.id = 'dealerHiddenCard';
      cardEl.innerHTML = `
        <div class="card-back-pattern">
          <span>MASA</span>
        </div>
      `;
    } else {
      cardEl.className = `card-item card-${card.color}`;
      cardEl.innerHTML = `
        <div class="card-corner top-left">
          <span class="card-rank">${card.rank}</span>
          <span class="card-suit-sm">${card.suit}</span>
        </div>
        <div class="card-center">${card.suit}</div>
        <div class="card-corner bottom-right">
          <span class="card-rank">${card.rank}</span>
          <span class="card-suit-sm">${card.suit}</span>
        </div>
      `;
    }
    return cardEl;
  }

  function updateUI() {
    // 1. Bankroll & Current Bet Display
    if (bankrollEl) bankrollEl.textContent = `$${bankroll.toLocaleString()}`;
    if (betDisplayEl) betDisplayEl.textContent = `$${currentBet.toLocaleString()}`;
    if (betCircleEl) {
      if (currentBet > 0) {
        betCircleEl.classList.add('has-bet');
      } else {
        betCircleEl.classList.remove('has-bet');
      }
    }

    const isBetting = (gameState === 'betting');

    // 2. Chip Buttons (only clickable in betting phase with sufficient bankroll)
    $$('.chip-btn').forEach(btn => {
      const chipVal = parseInt(btn.getAttribute('data-value'), 10);
      btn.disabled = !isBetting || bankroll < chipVal;
    });

    // 3. Bet Modifiers
    if (clearBetBtn) {
      clearBetBtn.disabled = !isBetting || currentBet === 0;
    }

    if (rebetBtn) {
      const canRebet = isBetting && lastBet > 0 && (bankroll + currentBet) >= lastBet;
      rebetBtn.disabled = !canRebet;
      rebetBtn.textContent = lastBet > 0 ? `Rebet ($${lastBet.toLocaleString()})` : 'Rebet';
    }

    if (doubleBetBtn) {
      doubleBetBtn.disabled = !isBetting || currentBet === 0 || bankroll < currentBet;
    }

    if (allInBtn) {
      allInBtn.disabled = !isBetting || bankroll === 0;
    }

    // 4. Main Action Button (Deal / Rebet & Deal)
    if (dealBtn) {
      if (!isBetting) {
        dealBtn.disabled = true;
        dealBtn.innerHTML = '<span>Deal Hand</span>';
      } else if (currentBet > 0) {
        dealBtn.disabled = false;
        dealBtn.innerHTML = '<span>Deal Hand</span>';
      } else if (lastBet > 0 && bankroll >= lastBet) {
        // Quick 1-click Rebet & Deal
        dealBtn.disabled = false;
        dealBtn.innerHTML = `<span>Rebet & Deal ($${lastBet.toLocaleString()})</span>`;
      } else {
        dealBtn.disabled = true;
        dealBtn.innerHTML = '<span>Deal Hand</span>';
      }
    }

    // 5. In-Round Decision Buttons
    const isPlayerTurn = (gameState === 'playerTurn');
    if (hitBtn) hitBtn.disabled = !isPlayerTurn;
    if (standBtn) standBtn.disabled = !isPlayerTurn;
    if (doubleBtn) {
      doubleBtn.disabled = !isPlayerTurn || playerHand.length !== 2 || bankroll < currentBet;
    }

    // 6. Stats Display
    if (statHandsEl) statHandsEl.textContent = stats.played;
    if (statWonEl) statWonEl.textContent = stats.won;
    if (statLostEl) statLostEl.textContent = stats.lost;
    if (statStreakEl) statStreakEl.textContent = `${stats.streak} (Best: ${stats.bestStreak})`;
    if (statWinRateEl) {
      const rate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
      statWinRateEl.textContent = `${rate}%`;
    }
  }

  function setStatus(text, className = '') {
    if (!statusMessageEl) return;
    statusMessageEl.className = `table-status-message ${className}`.trim();
    statusMessageEl.textContent = text;
  }

  // --- Betting Handlers ---
  function addBet(amount) {
    if (gameState !== 'betting') return;
    if (bankroll >= amount) {
      bankroll -= amount;
      currentBet += amount;
      playChipSound();
      updateUI();
      saveGameData();
    }
  }

  function clearBet() {
    if (gameState !== 'betting' || currentBet === 0) return;
    bankroll += currentBet;
    currentBet = 0;
    playChipSound();
    updateUI();
    saveGameData();
  }

  function rebet() {
    if (gameState !== 'betting' || lastBet <= 0) return;
    if (bankroll + currentBet < lastBet) {
      setStatus(`Not enough chips to rebet $${lastBet.toLocaleString()}!`, 'lose');
      return;
    }
    // Return any existing wager back to bankroll
    bankroll += currentBet;
    currentBet = 0;

    // Deduct and commit lastBet
    bankroll -= lastBet;
    currentBet = lastBet;
    playChipSound();
    updateUI();
    saveGameData();
    setStatus(`Rebet placed: $${currentBet.toLocaleString()}. Click Deal Hand to play!`);
  }

  function doubleCurrentBet() {
    if (gameState !== 'betting' || currentBet === 0) return;
    if (bankroll >= currentBet) {
      bankroll -= currentBet;
      currentBet *= 2;
      playChipSound();
      updateUI();
      saveGameData();
    }
  }

  function allInBet() {
    if (gameState !== 'betting' || bankroll === 0) return;
    currentBet += bankroll;
    bankroll = 0;
    playChipSound();
    updateUI();
    saveGameData();
  }

  // --- Gameplay Actions ---
  function startDeal() {
    if (gameState !== 'betting') return;

    if (currentBet === 0) {
      setStatus('Please place your chips on the table first!');
      return;
    }

    isDoubled = false;
    deck = createDeck(4);
    playerHand = [];
    dealerHand = [];
    gameState = 'dealing';
    updateUI();

    if (dealerCardsEl) dealerCardsEl.innerHTML = '';
    if (playerCardsEl) playerCardsEl.innerHTML = '';
    if (dealerScoreEl) dealerScoreEl.textContent = '0';
    if (playerScoreEl) playerScoreEl.textContent = '0';

    setStatus('Dealing cards...');

    // Deal 4 alternating cards
    playerHand.push(drawCard());
    dealerHand.push(drawCard());
    playerHand.push(drawCard());
    dealerHand.push(drawCard());

    // Render cards sequentially with casino timing
    playerCardsEl.appendChild(renderCard(playerHand[0]));
    playCardSound();

    setTimeout(() => {
      dealerCardsEl.appendChild(renderCard(dealerHand[0]));
      playCardSound();
      dealerScoreEl.textContent = dealerHand[0].value.toString();
    }, 200);

    setTimeout(() => {
      playerCardsEl.appendChild(renderCard(playerHand[1]));
      playCardSound();
      playerScoreEl.textContent = calculateHandScore(playerHand).toString();
    }, 400);

    setTimeout(() => {
      dealerCardsEl.appendChild(renderCard(dealerHand[1], true)); // Face down hole card
      playCardSound();

      // Check for Natural Blackjacks
      const playerBJ = isBlackjack(playerHand);
      const dealerBJ = isBlackjack(dealerHand);

      if (playerBJ || dealerBJ) {
        revealHoleCard();
        if (playerBJ && dealerBJ) {
          endRound('push', 'Both have Blackjack! Push (Tie).');
        } else if (playerBJ) {
          endRound('blackjack', 'BLACKJACK! You Win 3 to 2! 🎉');
        } else {
          endRound('lose', 'Dealer has Blackjack. Dealer wins.');
        }
      } else {
        gameState = 'playerTurn';
        setStatus('Your turn: Hit, Stand, or Double Down!');
        updateUI();
      }
    }, 600);
  }

  function hit() {
    if (gameState !== 'playerTurn') return;
    const newCard = drawCard();
    playerHand.push(newCard);
    playerCardsEl.appendChild(renderCard(newCard));
    playCardSound();

    const score = calculateHandScore(playerHand);
    playerScoreEl.textContent = score.toString();

    if (score > 21) {
      endRound('bust', 'Bust! Over 21. Dealer wins.');
    } else if (score === 21) {
      // Auto stand on 21
      stand();
    } else {
      updateUI();
    }
  }

  function doubleDown() {
    if (gameState !== 'playerTurn' || playerHand.length !== 2 || bankroll < currentBet) return;
    
    isDoubled = true;
    bankroll -= currentBet;
    currentBet *= 2;
    playChipSound();
    saveGameData();
    updateUI();

    const card = drawCard();
    playerHand.push(card);
    playerCardsEl.appendChild(renderCard(card));
    playCardSound();

    const score = calculateHandScore(playerHand);
    playerScoreEl.textContent = score.toString();

    if (score > 21) {
      endRound('bust', 'Bust on Double Down! Dealer wins.');
    } else {
      stand();
    }
  }

  function revealHoleCard() {
    const hiddenCard = $('#dealerHiddenCard');
    if (hiddenCard && dealerHand[1]) {
      const revealed = renderCard(dealerHand[1], false);
      hiddenCard.replaceWith(revealed);
      dealerScoreEl.textContent = calculateHandScore(dealerHand).toString();
    }
  }

  function stand() {
    if (gameState !== 'playerTurn') return;
    gameState = 'dealerTurn';
    updateUI();
    revealHoleCard();
    setStatus("Dealer's turn...");

    function dealerPlayLoop() {
      let dealerScore = calculateHandScore(dealerHand);
      dealerScoreEl.textContent = dealerScore.toString();

      if (dealerScore < 17) {
        setTimeout(() => {
          const card = drawCard();
          dealerHand.push(card);
          dealerCardsEl.appendChild(renderCard(card));
          playCardSound();
          dealerPlayLoop();
        }, 550);
      } else {
        // Dealer finished drawing
        evaluateWinner(dealerScore);
      }
    }

    setTimeout(dealerPlayLoop, 450);
  }

  function evaluateWinner(dealerScore) {
    const playerScore = calculateHandScore(playerHand);

    if (dealerScore > 21) {
      endRound('win', 'Dealer Busts! You Win! 💰');
    } else if (playerScore > dealerScore) {
      endRound('win', `You Win! (${playerScore} vs ${dealerScore}) 🏆`);
    } else if (playerScore < dealerScore) {
      endRound('lose', `Dealer Wins (${dealerScore} vs ${playerScore}).`);
    } else {
      endRound('push', `Push (Tie at ${playerScore}). Bet returned.`);
    }
  }

  function endRound(outcome, message) {
    stats.played += 1;

    if (outcome === 'blackjack') {
      const payout = currentBet + Math.round(currentBet * 1.5); // 3:2 payout (bet returned + 1.5x)
      bankroll += payout;
      stats.won += 1;
      stats.streak += 1;
      setStatus(message, 'blackjack');
      playBlackjackSound();
    } else if (outcome === 'win') {
      bankroll += currentBet * 2; // (bet returned + 1x)
      stats.won += 1;
      stats.streak += 1;
      setStatus(message, 'win');
      playWinSound();
    } else if (outcome === 'push') {
      bankroll += currentBet; // (bet returned)
      stats.pushed += 1;
      setStatus(message, 'push');
      playTone(440, 'sine', 0.15, 0.15);
    } else {
      // lose or bust: bet was already deducted when placed
      stats.lost += 1;
      stats.streak = 0;
      setStatus(message, 'lose');
      playBustSound();
    }

    if (stats.streak > stats.bestStreak) {
      stats.bestStreak = stats.streak;
    }

    // Save previous bet amount for Rebet feature (revert doubled bet to original base)
    lastBet = isDoubled ? Math.floor(currentBet / 2) : currentBet;
    currentBet = 0; // round bet is fully settled and cleared from felt
    isDoubled = false;

    // Immediately restore betting state so chips and rebet are active for the next hand
    gameState = 'betting';

    saveGameData();
    updateUI();

    // Check if player is broke
    if (bankroll === 0) {
      setTimeout(() => {
        setStatus('Out of chips! Click "Free Reload ($500)" to keep playing.', 'lose');
      }, 1000);
    }
  }

  // --- Attach Event Listeners ---
  $$('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value'), 10);
      if (val) addBet(val);
    });
  });

  clearBetBtn?.addEventListener('click', clearBet);
  rebetBtn?.addEventListener('click', rebet);
  doubleBetBtn?.addEventListener('click', doubleCurrentBet);
  allInBtn?.addEventListener('click', allInBet);

  dealBtn?.addEventListener('click', () => {
    if (gameState !== 'betting') return;
    if (currentBet === 0) {
      if (lastBet > 0 && bankroll >= lastBet) {
        // Quick 1-click Rebet & Deal
        bankroll -= lastBet;
        currentBet = lastBet;
        playChipSound();
        saveGameData();
        updateUI();
        startDeal();
      } else {
        setStatus('Please place your chips on the table first!');
      }
    } else {
      startDeal();
    }
  });

  hitBtn?.addEventListener('click', hit);
  standBtn?.addEventListener('click', stand);
  doubleBtn?.addEventListener('click', doubleDown);

  // Reload free chips
  reloadChipsBtn?.addEventListener('click', () => {
    bankroll += 500;
    saveGameData();
    updateUI();
    playWinSound();
    setStatus('Added $500 in chips! Place your bets and good luck!');
  });

  // Sound Toggle
  if (soundToggleBtn) {
    const updateSoundBtnIcon = () => {
      soundToggleBtn.innerHTML = isMuted 
        ? '<span>🔇 Sound: OFF</span>' 
        : '<span>🔊 Sound: ON</span>';
    };
    updateSoundBtnIcon();

    soundToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('masa_blackjack_sound_muted', isMuted.toString());
      updateSoundBtnIcon();
      if (!isMuted) playTone(600, 'sine', 0.1);
    });
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }
    const key = e.key.toLowerCase();
    if (key === ' ' || key === 'enter') {
      if (gameState === 'betting') {
        e.preventDefault();
        if (currentBet > 0) {
          startDeal();
        } else if (lastBet > 0 && bankroll >= lastBet) {
          bankroll -= lastBet;
          currentBet = lastBet;
          playChipSound();
          saveGameData();
          updateUI();
          startDeal();
        }
      }
    } else if (key === 'h' && gameState === 'playerTurn') {
      hit();
    } else if (key === 's' && gameState === 'playerTurn') {
      stand();
    } else if (key === 'd' && gameState === 'playerTurn' && !doubleBtn?.disabled) {
      doubleDown();
    } else if (key === 'c' && gameState === 'betting' && currentBet > 0) {
      clearBet();
    } else if (key === 'r' && gameState === 'betting' && lastBet > 0 && bankroll >= lastBet) {
      rebet();
    }
  });

  // Initial UI Render
  updateUI();
  setStatus('Place your chips on the table and hit Deal to play!');
}

