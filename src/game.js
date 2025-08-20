import { isAnswerCorrect } from './data.js';
import { pickFeedback, renderFeedbackOverlay } from './feedback.js';
import { updateHUD, updateTimerLabel, lockInput, showFinalScore } from './ui.js';

let state = null;

export function getState() {
  return state;
}

export function initGame(cards, feedback, settings) {
  const totalRounds = Math.max(10, Math.min(50, cards.length));
  state = {
    deck: shuffle(cards).slice(0, totalRounds),
    feedback,
    settings,
    totalRounds,
    roundIndex: 0,
    score: 0,
    timer: {
      handle: null,
      startMs: 0,
      durationSec: settings.timerSeconds
    },
    awaitingAdvance: false
  };
  updateHUD();
}

export function cleanupGame() {
  if (state && state.timer && state.timer.handle) {
    clearInterval(state.timer.handle);
  }
  state = null;
}

export function startRound() {
  if (!state) return;
  if (state.roundIndex >= state.totalRounds) {
    showFinalScore(state.score);
    return;
  }

  const card = state.deck[state.roundIndex];
  drawCard(card);
  updateHUD();
  lockInput(false);

  if (!state.settings.classicMode) startTimer(); else updateTimerLabel(state.settings.timerSeconds);
}

function drawCard(card) {
  const img = document.getElementById('cardImage');
  img.src = card.image;
  img.onload = () => renderArrow(card);
  img.onerror = () => {
    // fallback background color box
    img.removeAttribute('src');
    img.style.minHeight = '240px';
    renderArrow(card);
  };
}

function renderArrow(card) {
  const svg = document.getElementById('arrowOverlay');
  svg.innerHTML = '';
  // Use percentages to position an arrow marker (line + triangle) within viewBox 0..100
  const x = Math.max(0, Math.min(100, card.arrow.xPercent));
  const y = Math.max(0, Math.min(100, card.arrow.yPercent));
  const len = Math.max(24, card.arrow.lengthPx / 5); // slightly smaller arrow length
  const angle = (card.arrow.rotationDeg || 0) * Math.PI / 180;

  const x2 = x + Math.cos(angle) * (len * 0.7);
  const y2 = y + Math.sin(angle) * (len * 0.7);

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', String(x));
  line.setAttribute('y1', String(y));
  line.setAttribute('x2', String(x2));
  line.setAttribute('y2', String(y2));
  line.setAttribute('stroke', '#20D0C2');
  line.setAttribute('stroke-width', '1.6');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('filter', 'url(#arrowGlow)');

  const head = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  const headLen = len * 0.28; // slightly smaller head
  const hx = x2 + Math.cos(angle) * headLen;
  const hy = y2 + Math.sin(angle) * headLen;
  const left = rotatePoint(hx, hy, x2, y2, -135 * Math.PI / 180);
  const right = rotatePoint(hx, hy, x2, y2, 135 * Math.PI / 180);
  head.setAttribute('points', `${hx},${hy} ${left.x},${left.y} ${right.x},${right.y}`);
  head.setAttribute('fill', '#20D0C2');

  ensureGlow(svg);
  svg.appendChild(line);
  svg.appendChild(head);
}

function ensureGlow(svg) {
  const existing = svg.querySelector('#arrowGlow');
  if (existing) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'arrowGlow');
  const fe = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
  fe.setAttribute('dx', '0');
  fe.setAttribute('dy', '0');
  fe.setAttribute('stdDeviation', '1.2');
  fe.setAttribute('flood-color', '#20D0C2');
  fe.setAttribute('flood-opacity', '0.6');
  filter.appendChild(fe);
  defs.appendChild(filter);
  svg.appendChild(defs);
}

function rotatePoint(px, py, cx, cy, theta) {
  const sin = Math.sin(theta), cos = Math.cos(theta);
  const dx = px - cx, dy = py - cy;
  return { x: cx + dx * cos - dy * sin, y: cy + dx * sin + dy * cos };
}

function startTimer() {
  clearInterval(state.timer.handle);
  state.timer.startMs = performance.now();
  const duration = Math.max(1, Number(state.settings.timerSeconds || 5));
  state.timer.durationSec = duration;
  updateTimerLabel(duration);
  state.timer.handle = setInterval(() => {
    const elapsed = (performance.now() - state.timer.startMs) / 1000;
    const left = Math.max(0, duration - elapsed);
    updateTimerLabel(left);
    if (left <= 0.01) {
      clearInterval(state.timer.handle);
      onTimeout();
    }
  }, 50);
}

function onTimeout() {
  if (!state || state.awaitingAdvance) return;
  lockInput(true);
  showFeedback('wrong', { timeout: true });
}

export function submitAnswer(value) {
  if (!state || state.awaitingAdvance) return;
  lockInput(true);
  if (state.timer.handle) clearInterval(state.timer.handle);
  const card = state.deck[state.roundIndex];
  const correct = isAnswerCorrect(value, card);
  if (correct) {
    state.score += 1;
    showFeedback('correct');
  } else {
    showFeedback('wrong');
  }
}

function showFeedback(kind, opts = {}) {
  const overlay = document.getElementById('feedbackOverlay');
  overlay.removeAttribute('hidden');

  const phrase = pickFeedback(kind === 'correct' ? 'correct' : 'wrong', state.feedback, opts);
  renderFeedbackOverlay(overlay, kind, phrase);
  state.awaitingAdvance = true;

  const delay = kind === 'correct' ? 900 : 1100;
  setTimeout(() => {
    overlay.setAttribute('hidden', '');
    overlay.innerHTML = '';
    state.roundIndex += 1;
    state.awaitingAdvance = false;
    startRound();
  }, delay);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


