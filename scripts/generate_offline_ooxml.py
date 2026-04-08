#!/usr/bin/env python3
"""
Offline backup generator — PowerPoint + Word using only Python 3 stdlib (zipfile + xml).
Reads scripts/training_data.json (run: node scripts/export_training_data.js first).

Outputs:
  exports/powerpoint/Module_*.pptx, ALL_MODULES_Overview.pptx
  exports/word/*.docx

Deck theme: navy header bar + gold accent (matches plc-training web UI).
"""
from __future__ import annotations

import json
import re
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
JSON_PATH = SCRIPTS / "training_data.json"
EXPORTS = ROOT / "exports"
PPTX_DIR = EXPORTS / "powerpoint"
WORD_DIR = EXPORTS / "word"

KNOWLEDGE_ANSWERS = [
    "The PLC power supply converts incoming AC to low-voltage DC for the backplane and I/O. Field I/O is typically supplied 24 VDC (per cabinet design).",
    "N/O: open when de-energized, closes when true. N/C: closed when de-energized, opens when true.",
    "Likely causes: wiring fault (open, loose terminal, fuse) or NPN/PNP/common mismatch so the input circuit does not complete.",
    "OSSD = Output Signal Switching Device. Two independent channels so one fault cannot defeat the safety function.",
    "Same subnet as the PLC (e.g. 192.168.5.x with mask 255.255.255.0 for a 192.168.5.20 PLC).",
    "Communications → Who Active / Browse Chassis. Go online shortcut often Ctrl+D (confirm version).",
    "DN is ON when accumulated time reaches/exceeds preset — at 5000/5000 ms, DN is ON.",
    "Global tags are controller-wide; program-scoped tags are limited to their program unless exposed.",
    "Typical HMI levels: Operator, Maintenance/Technician, Administrator/Engineer (names vary).",
    "Level 2 — escalate servo/STO issues to Lead Technician / Noah Staudacher per policy.",
]


def safe_title_filename(title: str, max_len: int = 55) -> str:
    t = re.sub(r"[^\w\s-]+", "", str(title or "module"), flags=re.UNICODE)
    t = re.sub(r"[\s-]+", "_", t).strip("_") or "module"
    return t[:max_len]


def strip_html(s: str) -> str:
    if not s:
        return ""
    t = re.sub(r"<[^>]+>", "", str(s))
    t = t.replace("&nbsp;", " ")
    return " ".join(t.split()).strip()


def blocks_to_lines(blocks: list) -> list[str]:
    lines: list[str] = []

    def walk(blks):
        for b in blks or []:
            t = b.get("type")
            if t == "paragraph":
                lines.append(strip_html(b.get("text", "")))
            elif t == "heading":
                lines.append("→ " + strip_html(b.get("text", "")))
            elif t in ("list", "numbered", "steps"):
                for i, item in enumerate(b.get("items") or []):
                    prefix = f"{i + 1}. " if t == "numbered" else "• "
                    lines.append(prefix + strip_html(item))
            elif t == "callout":
                lines.append(f"[{b.get('variant', 'note').upper()}] {b.get('title', '')}: {strip_html(b.get('text', ''))}")
            elif t == "image":
                lines.append(f"[Figure] {strip_html(b.get('caption') or b.get('alt') or '')}")
            elif t == "table":
                hdrs = b.get("headers") or []
                lines.append("Table: " + " | ".join(hdrs))
                for row in b.get("rows") or []:
                    lines.append("  • " + " | ".join(str(c) for c in row))
            elif t == "sideBySide":
                walk(b.get("left") or [])
                walk(b.get("right") or [])

    walk(blocks)
    return [x for x in lines if x]


def chunk(lst: list, n: int):
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


def w_p(text: str) -> str:
    return (
        f'<w:p><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr>'
        f'<w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>'
    )


def w_heading(text: str, level: int) -> str:
    sz = 40 if level == 1 else 28
    return (
        f'<w:p><w:pPr><w:pStyle w:val="Heading{level}"/></w:pPr>'
        f'<w:r><w:rPr><w:b/><w:sz w:val="{sz}"/></w:rPr><w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>'
    )


def build_docx_xml(body_inner: str) -> bytes:
    document = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>{body_inner}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>"""
    return document.encode("utf-8")


def pack_docx(document_xml: bytes, out: Path):
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "[Content_Types].xml",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>""",
        )
        z.writestr(
            "_rels/.rels",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>""",
        )
        z.writestr("word/document.xml", document_xml)
        z.writestr(
            "word/_rels/document.xml.rels",
            '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>',
        )


# --- PowerPoint (minimal ECMA-376) ---
def build_pptx_slide_xml(title: str, bullets: list[str]) -> str:
    """One slide: title + body (a:text elements)."""
    body_parts = []
    for b in bullets:
        body_parts.append(
            f'<a:p><a:r><a:rPr sz="1400"/><a:t>{escape(b[:500])}</a:t></a:r></a:p>'
        )
    body_xml = "".join(body_parts) if body_parts else '<a:p><a:r><a:t></a:t></a:r></a:p>'
    return f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>
<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
<p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr sz="2800" b="1"/><a:solidFill><a:srgbClr val="1E3A5F"/></a:solidFill><a:t>{escape(title[:200])}</a:t></a:r></a:p></p:txBody></p:sp>
<p:sp><p:nvSpPr><p:cNvPr id="3" name="Content"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph idx="1" type="body"/></p:nvPr></p:nvSpPr>
<p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/>{body_xml}</p:txBody></p:sp>
</p:spTree></p:cSld></p:sld>"""


def pack_pptx(slides: list[tuple[str, list[str]]], out: Path, doc_title: str):
    """slides: list of (title, bullet strings)."""
    out.parent.mkdir(parents=True, exist_ok=True)
    slide_rels = []
    slide_parts = []
    for i, (stitle, bullets) in enumerate(slides, start=1):
        sid = f"slide{i}.xml"
        slide_parts.append((f"ppt/slides/{sid}", build_pptx_slide_xml(stitle, bullets)))
        slide_rels.append(
            f'<Relationship Id="rId{10 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/{sid}"/>'
        )

    sld_id_lst = "".join(
        f'<p:sldId id="{255 + i}" r:id="rId{10 + i}"/>' for i in range(1, len(slides) + 1)
    )
    presentation_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
<p:sldIdLst>{sld_id_lst}</p:sldIdLst></p:presentation>"""

    ct_overrides = "".join(
        f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
        for i in range(1, len(slides) + 1)
    )

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr(
            "[Content_Types].xml",
            f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
{ct_overrides}</Types>""",
        )
        z.writestr(
            "_rels/.rels",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>""",
        )
        z.writestr(
            "ppt/_rels/presentation.xml.rels",
            f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
{chr(10).join(f'<Relationship Id="rId{10 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>' for i in range(1, len(slides) + 1))}
</Relationships>""",
        )
        z.writestr("ppt/presentation.xml", presentation_xml.encode("utf-8"))
        # Minimal slide master (required by some Office versions)
        z.writestr(
            "ppt/slideMasters/slideMaster1.xml",
            """<?xml version="1.0" encoding="UTF-8"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
<p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld></p:sldMaster>""",
        )
        z.writestr(
            "ppt/slideMasters/_rels/slideMaster1.xml.rels",
            """<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>""",
        )
        for path, xml in slide_parts:
            z.writestr(path, xml.encode("utf-8"))
            name = path.split("/")[-1]
            z.writestr(
                f"ppt/slides/_rels/{name}.rels",
                """<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>""",
            )
        z.writestr(
            "ppt/slideLayouts/slideLayout1.xml",
            """<?xml version="1.0" encoding="UTF-8"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
 xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
 xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="title" preserve="1">
<p:cSld name="Title and Content"><p:spTree>
<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld></p:sldLayout>""",
        )


def write_scenarios_docx(td: dict, path: Path):
    parts = [w_heading("Hands-On Scenarios", 1)]
    parts.append(
        w_p(
            f"Reference: {td.get('title', '')} v{td.get('version', '')} ({td.get('revisionDate', '')})."
        )
    )
    for sc in td.get("scenarios") or []:
        parts.append(w_heading(f"Scenario {sc.get('id')}: {sc.get('title', '')}", 2))
        parts.append(w_p(f"Objective: {strip_html(sc.get('objective', ''))}"))
        parts.append(w_p(f"Time limit: {sc.get('timeLimit', '')}"))
        parts.append(w_p("Setup (instructor): " + strip_html(sc.get("setup", ""))))
        parts.append(w_heading("Steps", 3))
        for s in sc.get("steps") or []:
            parts.append(w_p(s))
        parts.append(w_p("Success criteria: " + strip_html(sc.get("successCriteria", ""))))
        parts.append(w_p(""))
    pack_docx(build_docx_xml("".join(parts)), path)


def write_escalation_docx(td: dict, path: Path):
    parts = [w_heading("Escalation Procedures", 1)]
    esc = td.get("escalation") or {}
    for lev in esc.get("levels") or []:
        parts.append(w_heading(f"Level {lev.get('level')}: {lev.get('title', '')}", 2))
        for item in lev.get("items") or []:
            parts.append(w_p("• " + item))
    parts.append(w_heading("Document before escalating", 2))
    for d in esc.get("documentation") or []:
        parts.append(w_p("• " + d))
    pack_docx(build_docx_xml("".join(parts)), path)


def write_knowledge_trainee(td: dict, path: Path):
    qs = td.get("knowledgeCheck") or []
    parts = [
        w_heading("Written Knowledge Check (Trainee)", 1),
        w_p(f"Name: __________________   Date: __________   Score: _____ / {len(qs)}"),
        w_p("Answer each question in complete sentences unless directed otherwise."),
    ]
    for i, q in enumerate(qs, 1):
        parts.append(w_heading(f"Question {i}", 2))
        parts.append(w_p(strip_html(q.get("question", ""))))
        parts.append(w_p("_" * 60))
        parts.append(w_p("_" * 60))
        parts.append(w_p(""))
    pack_docx(build_docx_xml("".join(parts)), path)


def write_knowledge_key(td: dict, path: Path):
    qs = td.get("knowledgeCheck") or []
    parts = [
        w_heading("Knowledge Check — Answer Key (Instructor)", 1),
        w_p("FOR INSTRUCTOR USE ONLY."),
    ]
    for i, q in enumerate(qs, 1):
        ans = KNOWLEDGE_ANSWERS[i - 1] if i <= len(KNOWLEDGE_ANSWERS) else "(Draft from materials.)"
        parts.append(w_heading(f"Question {i}", 2))
        parts.append(w_p(strip_html(q.get("question", ""))))
        parts.append(w_p("Suggested answer: " + ans))
        parts.append(w_p(""))
    pack_docx(build_docx_xml("".join(parts)), path)


def module_to_slides(td: dict, mod: dict) -> list[tuple[str, list[str]]]:
    slides: list[tuple[str, list[str]]] = []
    mid = mod.get("id")
    slides.append(
        (
            f"Module {mid}: {mod.get('title', '')}",
            [
                f"{td.get('title', '')} · {mod.get('format', '')} · {mod.get('hours', '')} h",
                f"v{td.get('version', '')} ({td.get('revisionDate', '')})",
            ],
        )
    )
    if mod.get("objectives"):
        slides.append(("Learning objectives", [strip_html(x) for x in mod["objectives"]]))
    d = strip_html(mod.get("description", ""))
    if d:
        slides.append(("Overview", [d]))
    for lesson in mod.get("lessons") or []:
        lt = lesson.get("title", "")
        summ = strip_html(lesson.get("summary", ""))
        slides.append((f"Lesson: {lt}", [summ] if summ else []))
        lines = blocks_to_lines(lesson.get("content") or [])
        for ch in chunk(lines, 10):
            slides.append((f"{lt} (content)", ch))
    for demo in mod.get("demoBreaks") or []:
        slides.append(
            (
                f"Lab: {demo.get('title', '')}",
                [
                    f"After: {demo.get('after', '')}",
                    f"Duration: {demo.get('duration', '')}",
                    strip_html(demo.get("description", "")),
                    strip_html(demo.get("activity", "")),
                ],
            )
        )
    for q in mod.get("quiz") or []:
        opts = " | ".join(strip_html(o) for o in (q.get("options") or []))
        slides.append(
            (
                "Quiz",
                [strip_html(q.get("question", "")), opts],
            )
        )
    return slides


def main():
    if not JSON_PATH.exists():
        print("Run: node scripts/export_training_data.js", file=sys.stderr)
        sys.exit(1)
    td = json.loads(JSON_PATH.read_text(encoding="utf-8")).get("TrainingData")
    if not td:
        sys.exit(1)

    PPTX_DIR.mkdir(parents=True, exist_ok=True)
    WORD_DIR.mkdir(parents=True, exist_ok=True)

    for mod in td.get("modules") or []:
        slides = module_to_slides(td, mod)
        if not slides:
            slides = [("Empty", ["No content"])]
        fname = f"Module_{mod.get('id')}_{safe_title_filename(mod.get('title', 'module'))}.pptx"
        pack_pptx(slides, PPTX_DIR / fname, mod.get("title", ""))
        print("Wrote", PPTX_DIR / fname)

    ov: list[tuple[str, list[str]]] = [
        (td.get("title", "PLC Training"), [td.get("subtitle", ""), td.get("revisionDate", "")])
    ]
    for mod in td.get("modules") or []:
        lines = [strip_html(mod.get("description", ""))]
        lines += [strip_html(x) for x in (mod.get("objectives") or [])]
        ov.append((f"Module {mod.get('id')}: {mod.get('title', '')}", [x for x in lines if x]))
    pack_pptx(ov, PPTX_DIR / "ALL_MODULES_Overview.pptx", "Overview")
    print("Wrote", PPTX_DIR / "ALL_MODULES_Overview.pptx")

    write_scenarios_docx(td, WORD_DIR / "Hands_On_Scenarios.docx")
    print("Wrote", WORD_DIR / "Hands_On_Scenarios.docx")
    write_escalation_docx(td, WORD_DIR / "Escalation_Procedures.docx")
    print("Wrote", WORD_DIR / "Escalation_Procedures.docx")
    write_knowledge_trainee(td, WORD_DIR / "Knowledge_Check_Trainee.docx")
    print("Wrote", WORD_DIR / "Knowledge_Check_Trainee.docx")
    write_knowledge_key(td, WORD_DIR / "Knowledge_Check_Answer_Key.docx")
    print("Wrote", WORD_DIR / "Knowledge_Check_Answer_Key.docx")
    print("Done:", EXPORTS)


if __name__ == "__main__":
    main()
