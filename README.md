# DigitalStudioz — Agency Site

**Branch policy:** work happens on the latest *-vN / project branch. List branches before editing. Never assume the GitHub default is the working line. Working line: `digitalstudioz-site-v1` (GitHub default is `main`).

> Custom WordPress sites for small businesses. Built to convert. The agency arm of the Jon-Beatz.com trio — design, dev, and coding for clients, shipped on the MyVizionStudio theme engine.

[![Live preview](https://img.shields.io/badge/preview-live-e0232a)](https://jonbeatz.github.io/DigitalStudioz-Site/)
[![Static site](https://img.shields.io/badge/site-static-181717?logo=google-chrome)](https://jonbeatz.github.io/DigitalStudioz-Site/)
[![Branch](https://img.shields.io/badge/branch-digitalstudioz--site--v1-e0232a)](https://github.com/jonbeatz/DigitalStudioz-Site/tree/digitalstudioz-site-v1)
[![Status](https://img.shields.io/badge/status-in%20progress-yellow)](#screenshots)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Live preview

**https://jonbeatz.github.io/DigitalStudioz-Site/**

![DigitalStudioz agency hero — dark mode](media/hero/agency-v2-hero.jpg?v=202610081700)

## What's inside

A single-page agency site — pure HTML/CSS/JS, no build step:

- **Hero** — full-bleed cycling red-lit studio photography (6s crossfade + manual dot controls, dark scrim), static build-dashboard browser frame, aurora-gradient headline treatment. Collapses to a chevron toggle on mobile.
- **Proof bar** — Lighthouse 100 / <2s loads / 14-day launches / +40% quote requests.
- **Services** — dark 3D coverflow fan (wraparound, arrows + dots + 01/04 counter, click/swipe/keyboard); nav dropdown deep-links each service to its card.
- **Nav** — Services dropdown, scrollspy active states, mobile accordion menu, Sonner-style form toasts.
- **Difference** — three desks (strategy, design & build, engineering & QA).
- **Work** — placeholder before/after case-study cards (real client work lands here).
- **Process** — four numbered steps (Discover / Design / Build / Launch + care) with editorial figure.
- **Pricing** — scroll parallax photo backdrop with dark overlay + vignette; fixed-quote positioning.
- **Contact** — demo quote form (toast only until wired to Formspree).
- **Footer** — Studio index menu box (numbered, scrollspy-aware), Elsewhere links, newsletter demo.

> Copy, metrics, and case studies are placeholders — design/look-and-feel first, final copy and evidence land later.

## Design language

Dark charcoal + signal red + warm gold. Big display type, hairline borders, soft layered shadows, mono data details. Red-lit studio photography throughout; light is a second design, never a toggle.

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Single `index.html` |
| Styling | Hand-written `style.css` (no framework) |
| Behavior | Vanilla `script.js` (no dependencies) |
| Images | Local `assets/` (versioned, byte-verified) |
| Hosting | GitHub Pages (static) |

## Project structure

```
├── index.html          # the whole site
├── style.css           # all styling
├── script.js           # fan, hero cycle, toasts, scrollspy, menus
├── assets/             # photography (hero backdrops, section figures, og-image)
├── media/hero/         # screenshot gallery (dark-mode hero + key views, ?v= cache-busted)
├── .nojekyll           # Pages: serve as-is
├── LICENSE
└── README.md
```

## Screenshots

### Hero

![Hero](media/hero/agency-v2-hero.jpg?v=202610081700)

### Services fan

![Services fan](media/hero/agency-v2-services.jpg?v=202610081700)

### Pricing

![Pricing](media/hero/agency-v2-pricing.jpg?v=202610081700)

### Mobile

![Mobile](media/hero/agency-v2-mobile.jpg?v=202610081700)

---

*Public site build. The private workshop repo (`jonbeatz/DigitalStudioz`) remains the system of record — this repo holds only the website.*
