import { getSettings } from './settings.js';
import { initGame, submitAnswer, startRound, cleanupGame, getState } from './game.js';

function showOnly(id) {
  const screens = document.querySelectorAll('[data-screen]');
  screens.forEach(s => {
    if (s.id === id) s.removeAttribute('hidden'); else s.setAttribute('hidden', '');
  });
}

export function showHomeScreen() {
  showOnly('screenHome');
}

export function showGameScreen() {
  showOnly('screenGame');
}

export function showSettingsScreen() {
  showOnly('screenSettings');
}

export function showResultsScreen() {
  showOnly('screenResults');
}

export function startGame(cards, feedback) {
  cleanupGame();
  const settings = getSettings();
  initGame(cards, feedback, settings);
  bindGameForm();
  startRound();
}

export function playAgain(cards, feedback) {
  showGameScreen();
  startGame(cards, feedback);
}

function bindGameForm() {
  const form = document.getElementById('answerForm');
  const input = document.getElementById('answerInput');
  form.onsubmit = (e) => {
    e.preventDefault();
    submitAnswer(input.value || '');
  };
}

export function updateHUD() {
  const { roundIndex, totalRounds, score, settings } = getState();
  document.getElementById('roundLabel').textContent = `${Math.min(roundIndex + 1, totalRounds)}/${totalRounds}`;
  document.getElementById('scoreLabel').textContent = String(score);
  const timerWrap = document.getElementById('timerWrap');
  if (settings.classicMode) timerWrap.style.visibility = 'hidden'; else timerWrap.style.visibility = 'visible';
}

export function updateTimerLabel(secondsLeft) {
  document.getElementById('timerLabel').textContent = String(Math.max(0, Math.ceil(secondsLeft)));
}

export function lockInput(disabled) {
  const input = document.getElementById('answerInput');
  const button = document.querySelector('#answerForm button[type="submit"]');
  input.disabled = disabled; button.disabled = disabled;
  if (!disabled) {
    input.value = '';
    input.focus();
  }
}

export function showFinalScore(score) {
  document.getElementById('finalScore').textContent = String(score);
  showResultsScreen();
}


