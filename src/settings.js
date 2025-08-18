const STORAGE_KEY = 'arrow-duh-settings-v1';

const DEFAULTS = {
  classicMode: false,
  timerSeconds: 5
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(partial) {
  const merged = { ...getSettings(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function initializeSettingsUI() {
  const s = getSettings();
  const modeToggle = document.getElementById('modeToggle');
  const timerSeconds = document.getElementById('timerSeconds');
  modeToggle.checked = !!s.classicMode;
  timerSeconds.value = String(s.timerSeconds);
}

export function applyModeToUI(settings) {
  const timerWrap = document.getElementById('timerWrap');
  if (!timerWrap) return;
  if (settings.classicMode) timerWrap.style.visibility = 'hidden'; else timerWrap.style.visibility = 'visible';
}


