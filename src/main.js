import { loadAllData } from './data.js';
import { initializeSettingsUI, getSettings, saveSettings, applyModeToUI } from './settings.js';
import { startGame, showHomeScreen, showGameScreen, showSettingsScreen, showResultsScreen, playAgain } from './ui.js';

async function bootstrap() {
  try {
    const { cards, feedback } = await loadAllData();

    // Wire nav
    document.getElementById('navHome').addEventListener('click', () => {
      showHomeScreen();
    });
    document.getElementById('navSettings').addEventListener('click', () => {
      showSettingsScreen();
    });

    // Home
    document.getElementById('playBtn').addEventListener('click', () => {
      showGameScreen();
      startGame(cards, feedback);
    });
    const howBtn = document.getElementById('howBtn');
    const howPanel = document.getElementById('howPanel');
    howBtn.addEventListener('click', () => {
      const hidden = howPanel.hasAttribute('hidden');
      if (hidden) howPanel.removeAttribute('hidden'); else howPanel.setAttribute('hidden', '');
    });

    // Settings
    initializeSettingsUI();
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
      saveSettings({
        classicMode: document.getElementById('modeToggle').checked,
        timerSeconds: Math.max(3, Math.min(20, parseInt(document.getElementById('timerSeconds').value || '5', 10)))
      });
      applyModeToUI(getSettings());
      showHomeScreen();
    });

    // Results
    document.getElementById('playAgainBtn').addEventListener('click', () => {
      playAgain(cards, feedback);
    });

    applyModeToUI(getSettings());
    showHomeScreen();
  } catch (err) {
    console.error('Failed to bootstrap:', err);
    alert('Failed to load game data. Please refresh.');
  }
}

bootstrap();


