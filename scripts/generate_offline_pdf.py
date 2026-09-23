#!/usr/bin/env python3
"""
PDF exports for email-safe sharing (best: convert real .pptx → .pdf via LibreOffice).

Priority:
1. LibreOffice `soffice` — PDFs match the PowerPoint files in exports/powerpoint/
2. fpdf2 — text-only PDFs from training data (if fpdf installed, LO missing/failed)
3. HTML in exports/html/ — print to PDF in browser (stdlib, no pip)
"""
from __future__ import annotations

import html as html_mod
import importlib.util
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

JSON_PATH = SCRIPTS / "training_data.json"
PPTX_DIR = ROOT / "exports" / "powerpoint"
PDF_DIR = ROOT / "exports" / "pdf"
HTML_DIR = ROOT / "exports" / "html"


def find_soffice() -> Optional[Path]:
    """LibreOffice / OpenOffice headless converter (Linux, macOS, Windows)."""
    for name in ("soffice", "libreoffice"):
        p = shutil.which(name)
        if p:
            return Path(p)
    mac = Path("/Applications/LibreOffice.app/Contents/MacOS/soffice")
    if mac.is_file():
        return mac
    pf = os.environ.get("ProgramFiles", r"C:\Program Files")
    for exe in (
        Path(pf) / "LibreOffice/program/soffice.exe",
        Path(pf) / "LibreOffice 7/program/soffice.exe",
    ):
        if exe.is_file():
            return exe
    return None


def export_pptx_to_pdf_libreoffice(pptx_dir: Path, pdf_dir: Path) -> bool:
    """
    Convert each .pptx in pptx_dir to a .pdf in pdf_dir (same basename).
    Returns True if every file converted successfully.
    """
    soffice = find_soffice()
    if not soffice:
        return False

    pptx_files = sorted(pptx_dir.glob("*.pptx"))
    if not pptx_files:
        return False

    pdf_dir.mkdir(parents=True, exist_ok=True)

    for pptx in pptx_files:
        expected = pdf_dir / f"{pptx.stem}.pdf"
        try:
            r = subprocess.run(
                [
                    str(soffice),
                    "--headless",
                    "--convert-to",
                    "pdf",
                    "--outdir",
                    str(pdf_dir.resolve()),
                    str(pptx.resolve()),
                ],
                capture_output=True,
                text=True,
                timeout=300,
                check=False,
            )
        except (OSError, subprocess.TimeoutExpired) as e:
            print(f"LibreOffice failed for {pptx.name}: {e}", file=sys.stderr)
            return False

        if r.returncode != 0:
            print(
                f"LibreOffice exit {r.returncode} for {pptx.name}:\n{r.stderr or r.stdout}",
                file=sys.stderr,
            )
            return False
        if not expected.is_file():
            print(f"LibreOffice did not create {expected}", file=sys.stderr)
            return False
        print("Wrote", expected)

    print(f"PowerPoint → PDF (LibreOffice): {len(pptx_files)} files in {pdf_dir}", file=sys.stderr)
    return True


def _find_dejavu() -> Optional[Path]:
    try:
        import fpdf

        root = Path(fpdf.__file__).resolve().parent
        for sub in ("font", "fonts"):
            d = root / sub
            if not d.is_dir():
                continue
            for name in ("DejaVuSans.ttf", "DejaVuSansCondensed.ttf"):
                p = d / name
                if p.is_file():
                    return p
    except ImportError:
        pass
    return None


def _escape(s: str) -> str:
    return html_mod.escape(s or "", quote=False)


def write_slides_html(
    slides: list[tuple[str, list[str]]], doc_title: str, out: Path, g
) -> None:
    """Print-friendly HTML; use browser Print → Save as PDF (stdlib, no pip)."""
    parts = [
        "<!DOCTYPE html>",
        '<html lang="en">',
        "<head>",
        '<meta charset="utf-8"/>',
        f"<title>{_escape(doc_title)}</title>",
        "<style>",
        "body{font-family:system-ui,Segoe UI,Roboto,sans-serif;margin:1.5rem;color:#1e293b;line-height:1.45;}",
        "h1{font-size:0.95rem;color:#64748b;font-weight:600;margin:0 0 1rem 0;}",
        ".slide{page-break-after:always;margin-bottom:2rem;}",
        ".slide:last-child{page-break-after:auto;}",
        ".slide h2{color:#1e3a5f;font-size:1.05rem;margin:0 0 0.6rem 0;}",
        ".slide ul{margin:0;padding-left:1.2rem;}",
        ".slide li{margin:0.3rem 0;}",
        "@media print{.slide{page-break-after:always;}body{margin:1rem;}}",
        "</style>",
        "</head>",
        "<body>",
        f"<h1>{_escape(doc_title)}</h1>",
    ]
    for slide_title, bullets in slides:
        parts.append('<section class="slide">')
        parts.append(f"<h2>{_escape(g.sanitize_ooxml_text(slide_title or ' ', max_len=500))}</h2>")
        parts.append("<ul>")
        for line in bullets or [" "]:
            parts.append(f"<li>{_escape(g.sanitize_ooxml_text(str(line), max_len=12000))}</li>")
        parts.append("</ul></section>")
    parts.append("</body></html>")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(parts), encoding="utf-8")


def export_pdf(td: dict, g) -> None:
    from fpdf import FPDF

    PDF_DIR.mkdir(parents=True, exist_ok=True)
    dejavu = _find_dejavu()

    def text_for_pdf(s: str) -> str:
        return g.sanitize_ooxml_text(s or "", max_len=16000)

    def new_pdf() -> FPDF:
        pdf = FPDF(format="Letter", unit="mm")
        pdf.set_auto_page_break(auto=True, margin=14)
        pdf.set_margins(18, 18, 18)
        if dejavu:
            pdf.add_font("DejaVu", "", str(dejavu))
            if (dejavu.parent / "DejaVuSans-Bold.ttf").is_file():
                pdf.add_font("DejaVu", "B", str(dejavu.parent / "DejaVuSans-Bold.ttf"))
            pdf.set_font("DejaVu", "", 10)
        else:
            pdf.set_font("Helvetica", "", 10)
        return pdf

    def write_slides(pdf: FPDF, slides: list[tuple[str, list[str]]]) -> None:
        for slide_title, bullets in slides:
            pdf.add_page()
            if dejavu and (dejavu.parent / "DejaVuSans-Bold.ttf").is_file():
                pdf.set_font("DejaVu", "B", 14)
            elif dejavu:
                pdf.set_font("DejaVu", "", 14)
            else:
                pdf.set_font("Helvetica", "B", 14)
            pdf.multi_cell(0, 8, text_for_pdf(slide_title))
            pdf.ln(2)
            pdf.set_font("DejaVu" if dejavu else "Helvetica", "", 10)
            for line in bullets or [" "]:
                pdf.multi_cell(0, 5.5, text_for_pdf(str(line)))
                pdf.ln(0.5)

    for mod in td.get("modules") or []:
        slides = g.module_to_slides(td, mod)
        if not slides:
            slides = [("Empty", ["No content"])]
        fname = f"Module_{mod.get('id')}_{g.safe_title_filename(mod.get('title', 'module'))}.pdf"
        pdf = new_pdf()
        write_slides(pdf, slides)
        out = PDF_DIR / fname
        pdf.output(str(out))
        print("Wrote", out)

    ov: list[tuple[str, list[str]]] = [
        (td.get("title", "PLC Training"), [td.get("subtitle", ""), td.get("revisionDate", "")])
    ]
    for mod in td.get("modules") or []:
        lines = [g.strip_html(mod.get("description", ""))]
        lines += [g.strip_html(x) for x in (mod.get("objectives") or [])]
        ov.append((f"Module {mod.get('id')}: {mod.get('title', '')}", [x for x in lines if x]))
    pdf = new_pdf()
    write_slides(pdf, ov)
    out = PDF_DIR / "ALL_MODULES_Overview.pdf"
    pdf.output(str(out))
    print("Wrote", out)
    print("Done PDF:", PDF_DIR)


def export_html_fallback(td: dict, g) -> None:
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    for mod in td.get("modules") or []:
        slides = g.module_to_slides(td, mod)
        if not slides:
            slides = [("Empty", ["No content"])]
        fname = f"Module_{mod.get('id')}_{g.safe_title_filename(mod.get('title', 'module'))}.html"
        title = f"{td.get('title', '')} · Module {mod.get('id')}: {mod.get('title', '')}"
        write_slides_html(slides, title, HTML_DIR / fname, g)
        print("Wrote", HTML_DIR / fname)

    ov: list[tuple[str, list[str]]] = [
        (td.get("title", "PLC Training"), [td.get("subtitle", ""), td.get("revisionDate", "")])
    ]
    for mod in td.get("modules") or []:
        lines = [g.strip_html(mod.get("description", ""))]
        lines += [g.strip_html(x) for x in (mod.get("objectives") or [])]
        ov.append((f"Module {mod.get('id')}: {mod.get('title', '')}", [x for x in lines if x]))
    write_slides_html(ov, td.get("title", "PLC Training") + " — Overview", HTML_DIR / "ALL_MODULES_Overview.html", g)
    print("Wrote", HTML_DIR / "ALL_MODULES_Overview.html")
    print(
        "Printable HTML (stdlib fallback, no pip): open any .html in Chrome/Edge → Print → Save as PDF.",
        file=sys.stderr,
    )
    print("Done HTML:", HTML_DIR)


def main() -> int:
    if not JSON_PATH.exists():
        print("Run: node scripts/export_training_data.js", file=sys.stderr)
        return 1

    import generate_offline_ooxml as g

    td = json.loads(JSON_PATH.read_text(encoding="utf-8")).get("TrainingData")
    if not td:
        return 1

    # Prefer PDFs converted from the actual PowerPoint files (matches layout/theme).
    if PPTX_DIR.is_dir() and export_pptx_to_pdf_libreoffice(PPTX_DIR, PDF_DIR):
        print("Done PDF:", PDF_DIR)
        return 0

    if importlib.util.find_spec("fpdf") is None:
        print(
            "Install LibreOffice (soffice) for PowerPoint→PDF, or pip install fpdf2 for text PDFs.",
            file=sys.stderr,
        )
        export_html_fallback(td, g)
    else:
        print("LibreOffice not available or conversion failed; using fpdf2 text PDFs.", file=sys.stderr)
        export_pdf(td, g)

    return 0


def write_distribution_zip() -> None:
    """Run last in the offline pipeline so the ZIP includes powerpoint/, word/, pdf/ and/or html/."""
    import generate_offline_ooxml as g

    if "--no-export-zip" in sys.argv:
        return
    zpath = g.zip_offline_exports(g.EXPORTS)
    if zpath:
        print(
            "Wrote",
            zpath,
            "(for email: attach this ZIP; extract on the PC — see README-Email.txt inside).",
        )


if __name__ == "__main__":
    rc = main()
    if rc == 0:
        write_distribution_zip()
    sys.exit(rc)
