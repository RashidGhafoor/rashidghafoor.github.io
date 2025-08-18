# Arrow D‑U‑H (MVP)

A lightweight browser game: guess the word the teal arrow is pointing at. Default timed mode (5s), optional Classic mode (untimed). Feedback overlays for win/fail with branded D‑U‑H.

## Run locally

Serve the folder statically (no build needed):

```bash
cd /path/to/game
python3 -m http.server 5173
# then open http://localhost:5173
```

## Structure

- `index.html`
- `src/`
  - `main.js`, `game.js`, `ui.js`, `data.js`, `feedback.js`, `settings.js`, `styles.css`
- `public/`
  - `assets/images/` (10 placeholder SVGs)
  - `assets/ui/arrow.svg`
  - `data/cards.json`
  - `data/feedback.json`
- `netlify.toml`

## Colors

- Background: #0E0F12
- Accent (arrow/buttons/timer): #20D0C2
- Success: #27C93F
- Fail/D‑U‑H: #FF3B30
- Secondary Text: #A3ADBF
- Primary Text: #F5F7FB
- Highlight: #FFC107

## Settings (persisted)

Stored in localStorage key `arrow-duh-settings-v1`.
- Classic Mode toggle (untimed)
- Timer seconds (default 5)

To change defaults, edit `DEFAULTS` in `src/settings.js`.

## Data files

### How to add new cards (public/data/cards.json)

Each card:
- `image`: relative URL in `/public/assets/images/`
- `answer`: canonical answer
- `alternates`: array of accepted alternates
- `arrow`: `{ xPercent, yPercent, rotationDeg, lengthPx }`
- optional `hint`, `difficulty`

Example card:

```json
{
  "id": "bldg-big-01",
  "image": "/public/assets/images/buildings-01.svg",
  "answer": "big",
  "alternates": ["large", "bigger"],
  "arrow": { "xPercent": 62.5, "yPercent": 38.0, "rotationDeg": -20, "lengthPx": 140 },
  "hint": "size adjective",
  "difficulty": 1
}
```

### Edit/add phrases and icons (public/data/feedback.json)

- `correct`: 15 phrases with `text`, `icon`
- `wrong`: 15 phrases; include `{"text":"D-U-H","icon":"🤦","weight":2}`
- `policies`: `{ "duhOnTimeout": true, "duhBiasWrong": 1.5 }`

Adjust `duhBiasWrong` to favor D‑U‑H on wrong answers (non-timeout). `duhOnTimeout: true` forces D‑U‑H on timeouts.

### Change default timer and mode

- Defaults live in `src/settings.js` under `DEFAULTS`:
  - `classicMode: false` → set to `true` for untimed by default
  - `timerSeconds: 5` → change to your preferred default

### Run/dev commands

Serve locally with any static server. Example:

```bash
cd /home/rashid/Projects/web-game
python3 -m http.server 5173
# open http://localhost:5173
```

### Deploy steps (Netlify)

1. Push to GitHub.
2. In Netlify, create a new site from your repo.
3. Publish directory: project root.
4. Optional: add a custom domain. `netlify.toml` already sets caching for `/public/*`.

## Deploy (Netlify)

- New site from repo
- Publish directory: project root
- `netlify.toml` includes caching for `/public/*`

## Notes

- Arrow is drawn via responsive SVG with percentage positioning, so it scales with the image container.
- Overlays animate ~0.9–1.1s and auto-advance to the next round.
