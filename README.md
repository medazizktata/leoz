# Leoz Gents Salon — concept site

A concept website for **Leoz Gents Salon**, a premium men's grooming salon in
Dubai (Palm Jumeirah + Sky Gardens): dark-gold, bilingual EN/AR, booking-forward.

## Run it
The site is a Vite + React app in `poc-app/`:

```
cd poc-app
pnpm install
pnpm dev            # http://localhost:5190
```

`pnpm build` emits static files to `poc-app/dist/`, published to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Structure
- `poc-app/` — the concept site (React + Vite + Tailwind).
- `poc/` — an earlier static build.
- `proposal/` — the gated Scope & Quotation (later phase).
- `brand/` — brand assets and imagery.
