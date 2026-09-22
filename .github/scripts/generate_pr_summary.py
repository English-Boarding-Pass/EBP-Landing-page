"""Generate a PR title and summary from diff.txt using the Gemini API.

Standard library only. Writes pr_title.txt (may be empty) and pr_summary.md.
Never fails the workflow: on a missing key or API errors it writes a fallback note.
"""

import json
import os
import re
import sys
import urllib.error
import urllib.request

DIFF_FILE = "diff.txt"
TITLE_FILE = "pr_title.txt"
SUMMARY_FILE = "pr_summary.md"
MAX_DIFF_CHARS = 50_000
TIMEOUT_SECONDS = 60

# Tried in order until one responds. Override with a comma-separated GEMINI_MODELS.
DEFAULT_MODELS = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"]

API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

TITLE_RE = re.compile(
    r"^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)"
    r"(\([a-zA-Z0-9_.-]+\))?!?: .{1,100}$"
)

PROMPT = """You are reviewing a pull request for a Next.js marketing landing page
(App Router, TypeScript, Tailwind CSS, next-intl with English, Sinhala and Tamil).

Write a pull request title and summary based on the diff below.

Output format, exactly:
- First line: TITLE: <type>(<scope>): <subject>
  - type is one of: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
  - subject is imperative, lowercase, no trailing period, whole line after "TITLE: " at most 72 characters
- Then a blank line, then this markdown:

## Pull Request Summary

### Overview & Purpose
<2-3 sentences on what this PR does and why>

### Key Changes by Component
<bullet list grouped by file or component>

### Verification Checklist
<3-6 "- [ ]" checkboxes a reviewer should verify, e.g. specific pages, locales, mobile layout>

Rules: no emojis, no code fences around the whole answer, be specific and concise.
If the diff is truncated, summarise what is visible and say so.

Diff:
{diff}
"""


def write_outputs(title: str, summary: str) -> None:
    with open(TITLE_FILE, "w", encoding="utf-8") as f:
        f.write(title)
    with open(SUMMARY_FILE, "w", encoding="utf-8") as f:
        f.write(summary)


def fallback(reason: str) -> None:
    print(f"warning: {reason}", file=sys.stderr)
    write_outputs(
        "",
        "## Pull Request Summary\n\n"
        f"_An AI summary could not be generated: {reason}_\n\n"
        "Please describe what changed and why, and add screenshots for UI changes.\n\n"
        "<sub>Maintainers: check that the `GEMINI_API_KEY` repository secret is set "
        "(Settings > Secrets and variables > Actions).</sub>\n",
    )


def call_gemini(model: str, api_key: str, prompt: str) -> str:
    body = json.dumps(
        {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.2},
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        API_URL.format(model=model),
        data=body,
        headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        data = json.load(response)
    parts = data["candidates"][0]["content"]["parts"]
    text = "".join(part.get("text", "") for part in parts).strip()
    if not text:
        raise ValueError("empty response")
    return text


def parse(text: str) -> tuple[str, str]:
    text = re.sub(r"^```[a-zA-Z]*\s*\n|\n```\s*$", "", text.strip()).strip()
    title = ""
    lines = text.splitlines()
    if lines and lines[0].upper().startswith("TITLE:"):
        candidate = lines[0].split(":", 1)[1].strip().strip("`\"'")
        if TITLE_RE.match(candidate) and len(candidate) <= 72:
            title = candidate
        text = "\n".join(lines[1:]).strip()
    return title, text


def main() -> None:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        fallback("the GEMINI_API_KEY secret is not available to this workflow run")
        return

    try:
        with open(DIFF_FILE, encoding="utf-8", errors="replace") as f:
            diff = f.read()
    except OSError as err:
        fallback(f"could not read {DIFF_FILE} ({err})")
        return

    if not diff.strip():
        fallback("the diff is empty after excluding lock files, images and build output")
        return

    if len(diff) > MAX_DIFF_CHARS:
        diff = diff[:MAX_DIFF_CHARS] + "\n\n[diff truncated]\n"

    models = [m.strip() for m in os.environ.get("GEMINI_MODELS", "").split(",") if m.strip()]
    prompt = PROMPT.format(diff=diff)

    for model in models or DEFAULT_MODELS:
        try:
            text = call_gemini(model, api_key, prompt)
        except urllib.error.HTTPError as err:
            try:
                detail = json.load(err)["error"]["message"]
            except Exception:
                detail = err.reason
            print(f"warning: {model} failed with HTTP {err.code}: {detail}", file=sys.stderr)
            continue
        except Exception as err:  # network errors, timeouts, unexpected payloads
            print(f"warning: {model} failed ({type(err).__name__}: {err})", file=sys.stderr)
            continue

        title, summary = parse(text)
        summary += f"\n\n---\n<sub>Generated automatically by `{model}` from the PR diff.</sub>\n"
        write_outputs(title, summary)
        print(f"summary generated with {model}; title: {title or '(none)'}")
        return

    fallback("every Gemini model in the fallback list failed; see the workflow log")


if __name__ == "__main__":
    main()
