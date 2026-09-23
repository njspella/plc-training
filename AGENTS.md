# PLC training site — agent instructions

This repo is the **PowerPoint → training website** from the PLC_Training_Updated.pptx conversion chat.

## Live site (GitHub Pages)

After HTML/CSS/JS changes, publish with:

```bash
npm run deploy
```

That runs `build`, commits if needed, pushes `main`, and GitHub Actions deploys `index.html` plus assets.

**First time only** (in a normal terminal, not always reliable in Cursor’s proxy sandbox):

```bash
gh auth login
npm run publish-github
```

On GitHub: **Settings → Pages → Source → GitHub Actions**.

## What to deploy

| Path | Role |
|------|------|
| `index.html` | Main interactive training app |
| `css/`, `js/`, `images/` | Site assets |
| `exports/html/*.html` | Optional per-module static HTML (included in Pages bundle when present) |

Do not commit secrets. `exports/`, `.venv/`, and large generated zips stay out of git per `.gitignore`.

## Build without push

```bash
npm run build
```

## Offline PowerPoint exports (separate from the website)

```bash
npm run generate-offline
```

That writes `exports/powerpoint/` and `exports/html/` — run `npm run deploy` afterward if those HTML exports should go live too.
