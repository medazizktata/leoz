# Leoz Gents Salon — concept site + quotation (Propagenda)

Sibling project to `p2p-apps`, built with the same pipeline. Two deliverables for the client
**Leoz Gents Salon** (Dubai — Palm Jumeirah + Sky Gardens):

1. **`poc/`** — the concept website (premium, dark-gold, bilingual EN/AR, booking-forward).
2. **`proposal/`** — the gated Scope & Quotation (reuses the p2p `build-host.mjs` encrypt →
   GitHub Pages pipeline; built in a later phase).

## Build pipeline (same as p2p)
Research (inspiration refs + brand recon) → **direction locked** → build concept via the
`impeccable` skill → independent **blind-QA** subagent → measure → walkthrough → deploy built
files to a public repo. The quote follows Track B: pricing-research subagents → build →
blind review → deploy gated.

## Structure
- `poc/` — static concept build + `deploy-pages.sh` (publishes built files to a public repo).
- `proposal/` — `build-host.mjs`, `_template.html`, invoice config (quote pipeline, later).
- `brand/` — direction & research:
  - `direction.html` — the design-direction board (open in a browser).
  - `CREATIVE-DIRECTION.md` — locked north star / brief.
  - `BRAND-RECON.md` — brand reconnaissance.
  - `assets/` — web-ready brand imagery (committed).
  - `site-grab/` — grab of the current leozbarber.com + logos (committed).
  - `drive/`, `photos/` — heavy originals from the Leoz Drive (**gitignored**, see below).

## Source assets (not in git)
Brand originals — company profile, the real price list, the professional photo shoots — live in
the **propagendamarketing** Google Drive. Repull with rclone (read-only remote `propaganda`):

```
rclone copy "propaganda,root_folder_id=1sU9QklJrrZYMWrm-2sbumGR7tAI8GK5e:" brand/photos/shoot-main/   # main shoot
rclone copy "propaganda,root_folder_id=13eoWSs3zLEBo7FD1g5klQpoF7XpN7Hkb:" brand/drive/branding/       # price list, letterhead, logos
```

## Direction (locked)
**B · The Lion, refined** — dark cinematic (Barbury) × ritual restraint (Louis XIII) × royal
heritage (Truefitt & Hill), on Leoz's own gold-on-black lion-and-crown brand.
Concept line: *"A king's grooming."* Full brief in `brand/CREATIVE-DIRECTION.md`.
