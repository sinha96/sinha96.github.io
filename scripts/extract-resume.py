#!/usr/bin/env python3
"""
extract-resume.py — read resume.pdf, split into KB chunks, write resume-kb.json.

The agent (index.html) fetches /resume-kb.json at boot alongside /posts-kb.json
and extends the in-memory knowledge base with these chunks. Re-run this whenever
resume.pdf changes:

    python3 -m venv .venv && .venv/bin/pip install pypdf
    .venv/bin/python scripts/extract-resume.py

The chunking is heuristic: it splits on common resume section headings
("Experience", "Education", "Skills", etc.) and falls back to fixed-size windows
for anything that doesn't slot into a section. Output is a JSON array with the
same shape as posts-kb.json so the agent can merge it uniformly.
"""

from __future__ import annotations
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "resume.pdf"
OUT_PATH = ROOT / "resume-kb.json"

# Sections we expect in a typical resume (case-insensitive heading match).
SECTION_HEADINGS = [
    "summary", "profile", "objective", "about",
    "experience", "work experience", "professional experience",
    "education", "academics",
    "skills", "technical skills", "core skills", "tools",
    "projects", "selected projects", "portfolio",
    "certifications", "certificates", "courses",
    "awards", "recognition", "honors", "achievements",
    "publications", "talks", "speaking",
    "languages", "interests", "hobbies",
    "contact",
]

# Min/max chunk length so retrieval stays useful.
MIN_CHARS = 80
MAX_CHARS = 900


def load_text() -> str:
    try:
        from pypdf import PdfReader
    except ImportError:
        sys.exit("pypdf not installed. Run: python3 -m venv .venv && "
                 ".venv/bin/pip install pypdf && .venv/bin/python scripts/extract-resume.py")
    reader = PdfReader(str(PDF_PATH))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def normalise(s: str) -> str:
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def looks_like_heading(line: str) -> str | None:
    """Return a canonical section name if the line is a known section heading."""
    stripped = line.strip(" \t·-—|:•").lower()
    if not stripped or len(stripped) > 40:
        return None
    if stripped in SECTION_HEADINGS:
        return stripped.title()
    return None


def split_into_sections(text: str) -> list[tuple[str, str]]:
    """Returns [(section_name, body), ...]. First block before any heading is 'Header'."""
    out: list[tuple[str, str]] = []
    cur_name = "Header"
    cur_lines: list[str] = []
    for raw_line in text.splitlines():
        heading = looks_like_heading(raw_line)
        if heading:
            if cur_lines:
                out.append((cur_name, "\n".join(cur_lines).strip()))
            cur_name = heading
            cur_lines = []
        else:
            cur_lines.append(raw_line)
    if cur_lines:
        out.append((cur_name, "\n".join(cur_lines).strip()))
    return [(name, body) for name, body in out if body]


def split_long(body: str, section: str) -> list[str]:
    """Split a long section body into MAX_CHARS-sized chunks at sentence boundaries."""
    body = normalise(body)
    if len(body) <= MAX_CHARS:
        return [body] if len(body) >= MIN_CHARS else []
    # Try splitting on blank lines first (paragraph-ish).
    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    chunks: list[str] = []
    buf = ""
    for p in paras:
        if len(buf) + len(p) + 2 <= MAX_CHARS:
            buf = (buf + "\n\n" + p).strip()
        else:
            if buf:
                chunks.append(buf)
            if len(p) <= MAX_CHARS:
                buf = p
            else:
                # Fall back to splitting on sentence punctuation.
                sentences = re.split(r"(?<=[.!?])\s+", p)
                sbuf = ""
                for s in sentences:
                    if len(sbuf) + len(s) + 1 <= MAX_CHARS:
                        sbuf = (sbuf + " " + s).strip()
                    else:
                        if sbuf:
                            chunks.append(sbuf)
                        sbuf = s
                if sbuf:
                    chunks.append(sbuf)
                buf = ""
    if buf:
        chunks.append(buf)
    return [c for c in chunks if len(c) >= MIN_CHARS]


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "x"


def main() -> int:
    if not PDF_PATH.exists():
        sys.exit(f"resume.pdf not found at {PDF_PATH}")
    text = normalise(load_text())
    sections = split_into_sections(text)
    out: list[dict] = []
    for sec_name, body in sections:
        pieces = split_long(body, sec_name)
        for i, chunk in enumerate(pieces):
            chunk_id = f"resume-{slug(sec_name)}-{i}"
            title = sec_name if len(pieces) == 1 else f"{sec_name} · part {i + 1}"
            out.append({
                "id": chunk_id,
                "section": "Résumé",
                "title": title,
                "text": chunk,
                "url": "resume.pdf",
            })
    OUT_PATH.write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"Wrote {len(out)} chunks → {OUT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
