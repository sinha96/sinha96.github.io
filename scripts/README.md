# scripts/

Build-time utilities for the portfolio.

## extract-resume.py

Reads `resume.pdf` and emits `resume-kb.json` — one chunk per resume section, in
the same shape as `posts-kb.json`. The agent (`index.html`) fetches this file at
boot and extends its knowledge base so it can answer résumé-specific questions
without you having to mirror PDF edits by hand.

### Run it whenever resume.pdf changes

```
python3 -m venv .venv
.venv/bin/pip install pypdf
.venv/bin/python scripts/extract-resume.py
git add resume-kb.json
git commit -m "Re-index resume.pdf"
```

### What it does

- Splits the text on common section headings (Summary / Experience / Education /
  Skills / Certifications / etc.) — case-insensitive, falls back to whole-text
  if no headings are found.
- Splits sections longer than ~900 chars at paragraph or sentence boundaries so
  chunks stay retrieval-sized.
- Writes a JSON array of `{id, section, title, text, url}` objects to
  `resume-kb.json` at the repo root.

If `pypdf` isn't installed it exits with the install command.
