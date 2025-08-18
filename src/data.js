const CARDS_URL = '/public/data/cards.json';
const FEEDBACK_URL = '/public/data/feedback.json';

export async function loadAllData() {
  const [cardsRes, feedbackRes] = await Promise.all([
    fetch(CARDS_URL),
    fetch(FEEDBACK_URL)
  ]);
  if (!cardsRes.ok || !feedbackRes.ok) throw new Error('Network error loading data');
  const cardsJson = await cardsRes.json();
  const feedbackJson = await feedbackRes.json();
  return { cards: cardsJson.cards, feedback: feedbackJson };
}

export function normalizeText(value) {
  return (value || '').toString().trim().toLowerCase();
}

export function isAnswerCorrect(inputValue, card) {
  const n = normalizeText(inputValue);
  if (!n) return false;
  if (normalizeText(card.answer) === n) return true;
  if (Array.isArray(card.alternates)) {
    return card.alternates.some(a => normalizeText(a) === n);
  }
  return false;
}

export function getRandomInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

export function randomFrom(array) {
  return array[getRandomInt(array.length)];
}

export function weightedRandom(items, extraBiasForDUH = 0) {
  // items: [{ text, icon, weight? }]; if text === 'D-U-H', add extraBiasForDUH to its weight
  const weights = items.map(item => {
    const base = Number(item.weight || 1);
    const bonus = item.text === 'D-U-H' ? Number(extraBiasForDUH || 0) : 0;
    return Math.max(0, base + bonus);
  });
  const total = weights.reduce((a,b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}


