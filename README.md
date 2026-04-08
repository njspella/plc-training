# PLC Tabletop Training (static site)

Single-page training app: modules, slide-style lessons, quizzes, scenarios, and browser text-to-speech.

## Publish on GitHub Pages (free, public URL)

1. Create a **new public repository** on GitHub (e.g. `plc-training`).
2. From this folder, add the remote and push:

   ```bash
   cd /path/to/plc-training
   git remote add origin https://github.com/YOUR_USERNAME/plc-training.git
   git push -u origin main
   ```

3. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
4. Open **Actions**, confirm the workflow **Deploy to GitHub Pages** ran successfully.
5. The site will be at:

   `https://YOUR_USERNAME.github.io/plc-training/`

   (Use your real username and repo name in the path.)

## Other quick options

- **Netlify Drop**: zip this folder (without `.git` if you like) and drag it onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Cloudflare Pages**: connect the GitHub repo or upload a folder.

## Offline backup (PowerPoint + Word)

There is **no original PowerPoint template** in this repository. Generated decks use a **Vermeer-style theme** (navy `#1e3a5f`, gold accent `#e8a820`) aligned with the web app.

Regenerate after editing `js/data.js`:

```bash
npm run generate-offline
```

(Requires **Node** and **Python 3** — no extra pip/npm packages.)

Outputs:

| Path | Contents |
|------|----------|
| `exports/powerpoint/Module_*.pptx` | One deck per module (objectives, lessons, labs, quiz preview) |
| `exports/powerpoint/ALL_MODULES_Overview.pptx` | Single overview of all modules |
| `exports/word/Hands_On_Scenarios.docx` | Hands-on scenario objectives, setup, steps, success criteria |
| `exports/word/Escalation_Procedures.docx` | Escalation levels + documentation checklist |
| `exports/word/Knowledge_Check_Trainee.docx` | Written knowledge check for trainees to complete |
| `exports/word/Knowledge_Check_Answer_Key.docx` | Instructor answer key |

Implementation: `scripts/export_training_data.js` → `scripts/training_data.json`, then `scripts/generate_offline_ooxml.py` builds OOXML (stdlib only).

If PowerPoint offers to **repair** a file, accept it, or paste slides into your corporate template and apply the **Slide Master** from your official Vermeer deck for pixel-perfect branding.

## Note

This material may be **internal / proprietary**. Confirm with your organization before hosting on a **public** URL. Use a **private** repo with access controls, or an internal host, if required.
