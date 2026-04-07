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

## Note

This material may be **internal / proprietary**. Confirm with your organization before hosting on a **public** URL. Use a **private** repo with access controls, or an internal host, if required.
