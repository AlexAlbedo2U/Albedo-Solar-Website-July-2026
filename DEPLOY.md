# Albedo Solar website v2 — deploy and configuration guide

## What this is
Marcus's build, reskinned to the Marca Albedo brand (light, warm, green #0F8769 + orange #F0A53C) with the June 2 spec fully applied. All 10 pages, bilingual ES/EN via the header toggle.

## Preview locally
Double-click `index.html`. Everything works from a local file, including the language toggle, estimator, videos and the contact form.

## Publish to GitHub Pages (2 minutes)
Option A, update Marcus's repo:
```
git push origin main
```
(Run from this folder; needs push access to github.com/0xcush/albedo-solar.)

Option B, your own repo:
1. Create a repo (e.g. `albedo-solar/website`) on github.com.
2. From this folder: `git remote set-url origin <your repo URL>` then `git push -u origin main`.
3. Repo Settings > Pages > Deploy from branch > main. Done.

To move to albedo-solar.com later: add a `CNAME` file containing `albedo-solar.com`, point the domain's DNS at GitHub Pages, and enable HTTPS in repo settings.

## One file to configure: `assets/js/config.js`
- **stats** — the live figures (projects, delinquency, CO2, savings). Edit here, every page updates.
- **LIVE_FEED_URL** — paste a JSON feed URL when the live tracker is ready; it overrides the numbers above automatically.
- **MAILCHIMP_ACTION** — paste the Mailchimp embedded-form action URL (Audience > Signup forms > Embedded forms, copy the `<form action="...">` URL). The footer signup starts working the moment it's set.
- **emailInvestors** — where investor form submissions go (currently investment@albedo-solar.com).
- **whatsapp / emailGeneral** — main contact channels.

## How the contact form routes
"Soy: Inversionista" opens the visitor's email app addressed to `emailInvestors` with everything filled in. Every other audience opens WhatsApp with a pre-filled message including their details. No third-party backend, no lead lost.

## Still pending (flagged in the spec)
- Sourced CO2 equivalencies for the Beneficios impact stats (comment left in the HTML).
- The savings graphic (`home-esp.jpg`) says "contrato de 4 años"; replace when the updated graphic exists.
- Live tracker feed for project counts.
- Optional SEO upgrade later: real `/en/` pages instead of the JS toggle (better for Google indexing of English content).
