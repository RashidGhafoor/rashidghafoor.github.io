import { randomFrom, weightedRandom } from './data.js';

export function pickFeedback(result, feedback, { timeout = false } = {}) {
  if (result === 'correct') {
    return randomFrom(feedback.correct);
  }
  if (timeout && feedback.policies && feedback.policies.duhOnTimeout) {
    return { text: 'D-U-H', icon: '🤦' };
  }
  const bias = feedback.policies ? Number(feedback.policies.duhBiasWrong || 0) : 0;
  return weightedRandom(feedback.wrong, bias);
}

export function renderFeedbackOverlay(container, kind, phrase) {
  // kind: 'correct' | 'wrong'
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = `feedback ${kind}`;

  if (phrase.text === 'D-U-H') {
    const cascade = document.createElement('div');
    cascade.className = 'duhCascade';
    const d = document.createElement('span'); d.textContent = 'D';
    const u = document.createElement('span'); u.textContent = 'U';
    const h = document.createElement('span'); h.textContent = 'H';
    cascade.appendChild(d); cascade.appendChild(u); cascade.appendChild(h);
    wrap.appendChild(cascade);
    setTimeout(() => d.classList.add('show'), 50);
    setTimeout(() => u.classList.add('show'), 150);
    setTimeout(() => h.classList.add('show'), 250);
  } else {
    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = phrase.icon || '🎯';
    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = phrase.text || '';
    wrap.appendChild(icon);
    wrap.appendChild(text);
  }

  container.appendChild(wrap);
}


