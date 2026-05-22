# PLC Tabletop Training (static site)

Single-page training app: modules, slide-style lessons, quizzes, scenarios, and browser text-to-speech.

## Slide hardware photos (HTML app)

Lessons use real Wikimedia Commons photos under `images/` (see `scripts/commons_images.py` and paths in `js/data.js`). The HTML app **tries local files first**; if a file is missing (for example before you run the downloader), the same photo is loaded **from** `upload.wikimedia.org` using `js/commonsImageUrls.js` (generated from the Python manifest).

**Download once** to cache photos under `images/` (faster, works offline, no hotlink):

```bash
npm run download-images
# or: python3 scripts/download_slide_images.py
```

After editing `COMMONS_IMAGES` in `scripts/commons_images.py`, regenerate the JS map:

```bash
npm run gen-commons-urls
# or: python3 scripts/emit_commons_image_urls_js.py
```

GitHub Actions **Deploy to GitHub Pages** runs the download script before copying the site, so deployed builds include the image files when the fetch succeeds.

If downloads fail with **connection reset** or **proxy CONNECT** errors, the scripts already try a **direct** connection (no `HTTP(S)_PROXY`) after proxied attempts—many corporate proxies break `CONNECT` to `upload.wikimedia.org`. You can force direct-only with:

```bash
WIKIMEDIA_DIRECT=1 npm run download-images
```

**Cursor’s agent terminal** often injects a localhost proxy: Wikimedia may still fail there even with the fix. Run the same command in a **normal system terminal**, set **`NO_PROXY=upload.wikimedia.org,.wikimedia.org`** if your network allows direct access, or use **Actions → Download slide images** on GitHub and unpack the artifact into `images/`.

Re-download everything (overwrites existing files):

```bash
DOWNLOAD_IMAGES_FORCE=1 npm run download-images
```

## Cursor agent: GitHub access and GitHub CLI

The Cursor **sandbox** can block or proxy outbound connections (often `HTTP(S)_PROXY` to localhost), which triggers **“Proxy CONNECT aborted”** when talking to GitHub.

1. **Policy files** — This repo includes **`.cursor/sandbox.json`** with `"networkPolicy": { "default": "allow" }`. You should also have the same merge source at **`~/.cursor/sandbox.json`** (see Cursor’s [`sandbox.json` reference](https://cursor.com/docs/reference/sandbox)). **Restart Cursor** after changing either file.

2. **UI confirmation** — In Cursor: **Settings → Auto-run controls → Sandbox networking** — choose **Allow all** (or a mode that includes your sandbox allowlist plus defaults).

3. **Install `gh` into `~/.local/bin`** (no sudo). Prefer your **desktop terminal** first if downloads still fail in the Agent terminal:

```bash
npm run install-gh
export PATH="$HOME/.local/bin:$PATH"
gh --version
```

## Publish on GitHub Pages (free, public URL)

### One-shot (recommended)

Install [GitHub CLI](https://cli.github.com/), then from this repo:

```bash
gh auth login
npm run publish-github
```

Creates `plc-training` on your account (or pushes if `origin` already exists), then turn on Pages below.

Optional environment variables:

- `GH_REPO_NAME` — repo name (default `plc-training`)
- `GH_REPO_VISIBILITY` — `public` or `private` (default `public`)

### Manual push

```bash
cd /path/to/plc-training
git remote add origin https://github.com/YOUR_USERNAME/plc-training.git
git push -u origin main
```

### Enable the website

1. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Open **Actions**, confirm **Deploy to GitHub Pages** ran successfully.
3. Open **`https://<your-login>.github.io/<repo>/`** (after the Pages deploy completes).

## Other quick options

- **Netlify Drop**: zip this folder (without `.git` if you like) and drag it onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages**: connect the GitHub repo or upload a folder.

## Offline backup (PowerPoint + Word)

There is **no original PowerPoint template** in this repository. Generated decks use a **Vermeer-style theme** (navy `#1e3a5f`, gold accent `#e8a820`) aligned with the web app.

Regenerate after editing `js/data.js`:

```bash
npm run generate-offline
```

**PowerPoint + Word only** (no PDF / distribution ZIP): refreshes `exports/powerpoint/*.pptx` and `exports/word/*.docx` from current training data. Run **`npm run download-images` first** on a machine that can reach Wikimedia so slide photos are cached under `images/` and embedded as real photos (not diagram fallbacks).

```bash
npm run download-images && npm run regenerate-pptx
```

The last step builds **`exports/PLC_Training_Offline_Exports.zip`** (even if optional PDFs are skipped). If you only run `generate_offline_ooxml.py` by hand, run `python3 scripts/generate_offline_pdf.py` afterward to create that ZIP.

Requires **Node** and **Python 3** (stdlib only). **PowerPoint** `.pptx` files are always generated using a **stdlib OOXML** writer (valid DrawingML so desktop PowerPoint can open them). Optional **`python-pptx`** adds the same **Vermeer** look as the web app (navy header, gold accent, light gray content area). **Without it**, the stdlib exporter still **embeds lesson images** in `.pptx` when remote URLs download or `images/...` paths exist (cache: `exports/.offline_image_cache/`). One-liner when `pip` works: `npm run generate-offline:deps`.

```bash
pip install -r scripts/requirements-offline.txt
# or: pip install python-pptx
```

**Word** `.docx` files use the same script and need no extra packages.

**If PowerPoint or Outlook preview says the file is corrupt or unreadable:** regenerate with the latest `scripts/generate_offline_ooxml.py` (the stdlib `.pptx` writer now includes a full Office-style package: `notesSz`, slide master IDs, theme part, and layout links—older builds were too minimal for some Microsoft apps). Then copy fresh files from `exports/powerpoint/`. Installing **`python-pptx`** (`pip install -r scripts/requirements-offline.txt`) uses the library generator instead and is the most compatible option.

**Sending by Gmail (or any mail):** After `npm run generate-offline`, attach **`exports/PLC_Training_Offline_Exports.zip`** (built automatically). Do not open `.pptx` from Gmail’s web preview—download the ZIP, extract it, then open files in **desktop** PowerPoint. The archive includes **`exports/pdf/`** — **PDF versions of each PowerPoint** when **LibreOffice** is installed (`soffice` on `PATH`; e.g. `apt install libreoffice`). Those PDFs match the `.pptx` layout. If LibreOffice is missing, the script falls back to **fpdf2** (pip) or printable **HTML**. PDFs usually survive email where raw Office files do not. For the most reliable handoff, upload the ZIP to **Google Drive** and share a link. Pass `--no-export-zip` to `scripts/generate_offline_pdf.py` if you need to skip creating the ZIP.

Outputs:

| Path | Contents |
|------|----------|
| `exports/powerpoint/Module_*.pptx` | One deck per module (objectives, lessons, labs, quiz preview) |
| `exports/powerpoint/ALL_MODULES_Overview.pptx` | Single overview of all modules |
| `exports/word/Hands_On_Scenarios.docx` | Hands-on scenario objectives, setup, steps, success criteria |
| `exports/word/Escalation_Procedures.docx` | Escalation levels + documentation checklist |
| `exports/word/Knowledge_Check_Trainee.docx` | Written knowledge check for trainees to complete |
| `exports/word/Knowledge_Check_Answer_Key.docx` | Instructor answer key |
| `exports/pdf/*.pdf` | **PowerPoint decks as PDF** (LibreOffice `soffice` converts each `.pptx`); else **fpdf2** text PDFs if pip-installed |
| `exports/html/*.html` | Printable slides (fallback if no LibreOffice and no fpdf2): browser → Print → Save as PDF |
| `exports/PLC_Training_Offline_Exports.zip` | PowerPoint + Word + PDFs + `README-Email.txt` (best Gmail attachment) |

Implementation: `scripts/export_training_data.js` → `scripts/training_data.json`, then `scripts/generate_offline_ooxml.py` builds Word OOXML (stdlib) and PowerPoint (stdlib OOXML, or **python-pptx** when installed for themed bars), then `scripts/generate_offline_pdf.py` builds **`exports/pdf/`** from those `.pptx` files via **LibreOffice** when available, otherwise **fpdf2**, otherwise **HTML**.

If PowerPoint offers to **repair** a file, accept it, or paste slides into your corporate template and apply the **Slide Master** from your official Vermeer deck for pixel-perfect branding.

## Note

This material may be **internal / proprietary**. Confirm with your organization before hosting on a **public** URL. Use a **private** repo with access controls, or an internal host, if required.
