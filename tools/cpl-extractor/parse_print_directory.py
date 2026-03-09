#!/usr/bin/env python3
"""Step 2: Parse the raw CPL directory HTML into structured rows.

Reads data/cpl_raw.html and extracts test records using multiple
parsing strategies (table-based, card-based, definition-list).

Output: data/cpl_tests_raw.csv
"""

from __future__ import annotations

import csv
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, Tag

from utils.helpers import (
    DATA_DIR,
    parse_cpt_codes,
    score_parse_confidence,
    setup_logging,
)

logger = setup_logging("parse")

INPUT_FILE = DATA_DIR / "cpl_raw.html"
OUTPUT_FILE = DATA_DIR / "cpl_tests_raw.csv"

FIELDNAMES = [
    "cpl_code",
    "test_name",
    "aliases",
    "cpt_codes",
    "specimen_type",
    "container",
    "volume",
    "methodology",
    "turnaround_time",
    "reference_range",
    "notes",
    "parse_confidence",
]


# ── Field extraction helpers ──────────────────────────────────────────────────

# Patterns for extracting specific fields from text blocks
_CODE_PATTERNS = [
    re.compile(r"(?:Test|Order|CPL)\s*(?:Code|Number|#|ID)\s*[:\-]?\s*(\w[\w\-]+)", re.I),
    re.compile(r"^(\d{4,8})(?:\s|$)", re.M),
]

_SPECIMEN_PATTERNS = [
    re.compile(r"Specimen\s*(?:Type)?\s*[:\-]?\s*(.+?)(?:\n|$|;)", re.I),
    re.compile(r"(?:Source|Sample)\s*[:\-]?\s*(.+?)(?:\n|$|;)", re.I),
]

_CONTAINER_PATTERNS = [
    re.compile(r"(?:Container|Tube)\s*(?:Type)?\s*[:\-]?\s*(.+?)(?:\n|$|;)", re.I),
]

_VOLUME_PATTERNS = [
    re.compile(r"(?:Volume|Amount|Quantity)\s*[:\-]?\s*(.+?)(?:\n|$|;)", re.I),
    re.compile(r"(\d+(?:\.\d+)?\s*(?:mL|ml|uL|µL|cc))", re.I),
]

_METHOD_PATTERNS = [
    re.compile(r"(?:Method|Methodology|Technique)\s*[:\-]?\s*(.+?)(?:\n|$|;)", re.I),
]

_TAT_PATTERNS = [
    re.compile(r"(?:Turnaround|TAT|Turn\s*Around)\s*(?:Time)?\s*[:\-]?\s*(.+?)(?:\n|$|;)", re.I),
    re.compile(r"(\d+[\-–]\d+\s*(?:days?|hours?|hrs?))", re.I),
]

_REFRANGE_PATTERNS = [
    re.compile(r"(?:Reference|Normal)\s*(?:Range|Values?|Interval)?\s*[:\-]?\s*(.+?)(?:\n|$)", re.I),
]

_ALIAS_PATTERNS = [
    re.compile(r"(?:Alias|Also\s*Known\s*As|AKA|Synonyms?|Alt(?:ernate)?\s*Names?)\s*[:\-]?\s*(.+?)(?:\n|$)", re.I),
]

_CPT_PATTERNS = [
    re.compile(r"CPT\s*(?:Code)?s?\s*[:\-]?\s*(.+?)(?:\n|$)", re.I),
]


def _extract_field(text: str, patterns: list[re.Pattern[str]]) -> str:
    """Try each pattern and return the first match's group(1), stripped."""
    for pat in patterns:
        m = pat.search(text)
        if m:
            return m.group(1).strip()
    return ""


def _extract_code(text: str) -> str:
    """Extract a CPL test code from text."""
    return _extract_field(text, _CODE_PATTERNS)


def _clean_text(text: str) -> str:
    """Collapse whitespace and strip."""
    return re.sub(r"\s+", " ", text).strip()


# ── Parsing strategies ────────────────────────────────────────────────────────


def _parse_table(soup: BeautifulSoup) -> list[dict[str, str]]:
    """Strategy 1: Parse HTML tables with headers."""
    records: list[dict[str, str]] = []

    for table in soup.find_all("table"):
        # Find header row
        headers: list[str] = []
        header_row = table.find("tr")
        if not header_row:
            continue

        for th in header_row.find_all(["th", "td"]):
            headers.append(_clean_text(th.get_text()).lower())

        if not headers:
            continue

        # Map headers to our fields
        col_map: dict[int, str] = {}
        for i, h in enumerate(headers):
            h_lower = h.lower()
            if any(k in h_lower for k in ["test code", "order code", "cpl code", "test #", "code"]):
                col_map[i] = "cpl_code"
            elif any(k in h_lower for k in ["test name", "test description", "name"]):
                col_map[i] = "test_name"
            elif "cpt" in h_lower:
                col_map[i] = "cpt_codes"
            elif any(k in h_lower for k in ["specimen", "source", "sample"]):
                col_map[i] = "specimen_type"
            elif any(k in h_lower for k in ["container", "tube"]):
                col_map[i] = "container"
            elif any(k in h_lower for k in ["volume", "amount"]):
                col_map[i] = "volume"
            elif any(k in h_lower for k in ["method", "technique"]):
                col_map[i] = "methodology"
            elif any(k in h_lower for k in ["turnaround", "tat"]):
                col_map[i] = "turnaround_time"
            elif any(k in h_lower for k in ["reference", "normal", "range"]):
                col_map[i] = "reference_range"
            elif any(k in h_lower for k in ["alias", "synonym", "aka", "alternate"]):
                col_map[i] = "aliases"
            elif any(k in h_lower for k in ["note", "comment"]):
                col_map[i] = "notes"

        if not col_map:
            continue

        # Parse data rows
        rows = table.find_all("tr")[1:]
        for row in rows:
            cells = row.find_all(["td", "th"])
            if len(cells) < 2:
                continue

            record: dict[str, str] = {f: "" for f in FIELDNAMES}
            filled = 0
            for i, cell in enumerate(cells):
                if i in col_map:
                    val = _clean_text(cell.get_text())
                    if val:
                        record[col_map[i]] = val
                        filled += 1

            if filled >= 2 and (record["cpl_code"] or record["test_name"]):
                # Parse CPT codes from the CPT field
                if record["cpt_codes"]:
                    codes = parse_cpt_codes(record["cpt_codes"])
                    record["cpt_codes"] = ";".join(codes)

                record["parse_confidence"] = score_parse_confidence(
                    has_code=bool(record["cpl_code"]),
                    has_name=bool(record["test_name"]),
                    has_cpt=bool(record["cpt_codes"]),
                    has_specimen=bool(record["specimen_type"]),
                    field_count=filled,
                )
                records.append(record)

    return records


def _parse_cards(soup: BeautifulSoup) -> list[dict[str, str]]:
    """Strategy 2: Parse card/div-based layouts.

    Sonic Healthcare directories often use div-based cards for each test,
    with label/value pairs inside.
    """
    records: list[dict[str, str]] = []

    # Look for repeated structural patterns (divs, sections, articles)
    card_selectors = [
        "div.test-card", "div.test-item", "div.test-detail",
        "div.testCard", "div.testItem", "div.testDetail",
        "div.card", "article", "section.test",
        "div[class*='test']", "div[class*='Test']",
        "div[class*='result']", "div[class*='Result']",
        "div[class*='item']",
        "tr",  # Fall through to table rows if nothing else matches
    ]

    for selector in card_selectors:
        cards = soup.select(selector)
        if len(cards) < 5:
            continue

        for card in cards:
            text = card.get_text("\n", strip=True)
            if len(text) < 10:
                continue

            record: dict[str, str] = {f: "" for f in FIELDNAMES}

            # Extract fields from the text block
            record["cpl_code"] = _extract_code(text)
            record["specimen_type"] = _extract_field(text, _SPECIMEN_PATTERNS)
            record["container"] = _extract_field(text, _CONTAINER_PATTERNS)
            record["volume"] = _extract_field(text, _VOLUME_PATTERNS)
            record["methodology"] = _extract_field(text, _METHOD_PATTERNS)
            record["turnaround_time"] = _extract_field(text, _TAT_PATTERNS)
            record["reference_range"] = _extract_field(text, _REFRANGE_PATTERNS)
            record["aliases"] = _extract_field(text, _ALIAS_PATTERNS)
            record["notes"] = ""

            # Extract CPT codes
            cpt_raw = _extract_field(text, _CPT_PATTERNS)
            if cpt_raw:
                record["cpt_codes"] = ";".join(parse_cpt_codes(cpt_raw))
            else:
                # Try extracting from the full text
                all_cpts = parse_cpt_codes(text)
                if all_cpts:
                    record["cpt_codes"] = ";".join(all_cpts)

            # Test name: try headings first, then first prominent text
            name_el = card.find(["h1", "h2", "h3", "h4", "h5", "strong", "b"])
            if name_el:
                record["test_name"] = _clean_text(name_el.get_text())
            else:
                # Use the first line of text that looks like a name
                lines = [l.strip() for l in text.split("\n") if l.strip()]
                for line in lines:
                    # Skip lines that look like labels or short codes
                    if len(line) > 3 and not re.match(r"^(Test|Order|CPL|Code|CPT|Specimen|Container|Volume|Method)", line, re.I):
                        record["test_name"] = _clean_text(line)
                        break

            if record["test_name"] or record["cpl_code"]:
                filled = sum(1 for f in FIELDNAMES if record.get(f) and f != "parse_confidence")
                record["parse_confidence"] = score_parse_confidence(
                    has_code=bool(record["cpl_code"]),
                    has_name=bool(record["test_name"]),
                    has_cpt=bool(record["cpt_codes"]),
                    has_specimen=bool(record["specimen_type"]),
                    field_count=filled,
                )
                records.append(record)

        if records:
            break  # Found a working selector

    return records


def _parse_definition_lists(soup: BeautifulSoup) -> list[dict[str, str]]:
    """Strategy 3: Parse dl/dt/dd definition list layouts."""
    records: list[dict[str, str]] = []

    for dl in soup.find_all("dl"):
        dts = dl.find_all("dt")
        dds = dl.find_all("dd")
        if len(dts) < 2 or len(dts) != len(dds):
            continue

        # Each dt/dd pair might be a field for a single test,
        # or each dt might be a test name with dd containing details
        for dt, dd in zip(dts, dds):
            dt_text = _clean_text(dt.get_text())
            dd_text = dd.get_text("\n", strip=True)

            record: dict[str, str] = {f: "" for f in FIELDNAMES}
            record["test_name"] = dt_text
            record["cpl_code"] = _extract_code(dd_text)
            record["specimen_type"] = _extract_field(dd_text, _SPECIMEN_PATTERNS)
            record["container"] = _extract_field(dd_text, _CONTAINER_PATTERNS)
            record["volume"] = _extract_field(dd_text, _VOLUME_PATTERNS)
            record["methodology"] = _extract_field(dd_text, _METHOD_PATTERNS)
            record["turnaround_time"] = _extract_field(dd_text, _TAT_PATTERNS)
            record["reference_range"] = _extract_field(dd_text, _REFRANGE_PATTERNS)
            record["aliases"] = _extract_field(dd_text, _ALIAS_PATTERNS)

            cpt_raw = _extract_field(dd_text, _CPT_PATTERNS)
            if cpt_raw:
                record["cpt_codes"] = ";".join(parse_cpt_codes(cpt_raw))

            if record["test_name"]:
                filled = sum(1 for f in FIELDNAMES if record.get(f) and f != "parse_confidence")
                record["parse_confidence"] = score_parse_confidence(
                    has_code=bool(record["cpl_code"]),
                    has_name=bool(record["test_name"]),
                    has_cpt=bool(record["cpt_codes"]),
                    has_specimen=bool(record["specimen_type"]),
                    field_count=filled,
                )
                records.append(record)

    return records


def _parse_free_text(soup: BeautifulSoup) -> list[dict[str, str]]:
    """Strategy 4: Last resort — split body text by test-like boundaries."""
    records: list[dict[str, str]] = []

    body = soup.find("body")
    if not body:
        return records

    text = body.get_text("\n", strip=True)

    # Look for repeating patterns that delimit test entries.
    # Common pattern: a test code on its own line followed by test name
    # e.g., "12345\nComplete Blood Count\nCPT: 85025\nSpecimen: Whole Blood"
    blocks = re.split(r"\n(?=\d{4,8}\s)", text)

    for block in blocks:
        block = block.strip()
        if len(block) < 10:
            continue

        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if len(lines) < 2:
            continue

        record: dict[str, str] = {f: "" for f in FIELDNAMES}

        # First line might be the code
        if re.match(r"^\d{4,8}$", lines[0]):
            record["cpl_code"] = lines[0]
            record["test_name"] = lines[1] if len(lines) > 1 else ""
        else:
            record["cpl_code"] = _extract_code(block)
            record["test_name"] = lines[0]

        # Extract remaining fields from the block
        record["specimen_type"] = _extract_field(block, _SPECIMEN_PATTERNS)
        record["container"] = _extract_field(block, _CONTAINER_PATTERNS)
        record["volume"] = _extract_field(block, _VOLUME_PATTERNS)
        record["methodology"] = _extract_field(block, _METHOD_PATTERNS)
        record["turnaround_time"] = _extract_field(block, _TAT_PATTERNS)
        record["reference_range"] = _extract_field(block, _REFRANGE_PATTERNS)
        record["aliases"] = _extract_field(block, _ALIAS_PATTERNS)

        cpt_raw = _extract_field(block, _CPT_PATTERNS)
        if cpt_raw:
            record["cpt_codes"] = ";".join(parse_cpt_codes(cpt_raw))
        else:
            all_cpts = parse_cpt_codes(block)
            if all_cpts:
                record["cpt_codes"] = ";".join(all_cpts)

        if record["test_name"] or record["cpl_code"]:
            filled = sum(1 for f in FIELDNAMES if record.get(f) and f != "parse_confidence")
            record["parse_confidence"] = score_parse_confidence(
                has_code=bool(record["cpl_code"]),
                has_name=bool(record["test_name"]),
                has_cpt=bool(record["cpt_codes"]),
                has_specimen=bool(record["specimen_type"]),
                field_count=filled,
            )
            records.append(record)

    return records


# ── Main ──────────────────────────────────────────────────────────────────────


def parse_html(html: str) -> list[dict[str, str]]:
    """Parse raw HTML using multiple strategies, return the best result."""
    soup = BeautifulSoup(html, "lxml")

    strategies = [
        ("table", _parse_table),
        ("card/div", _parse_cards),
        ("definition list", _parse_definition_lists),
        ("free text", _parse_free_text),
    ]

    best: list[dict[str, str]] = []
    best_strategy = "none"

    for name, fn in strategies:
        try:
            result = fn(soup)
            logger.info("Strategy '%s': %d records", name, len(result))
            if len(result) > len(best):
                best = result
                best_strategy = name
        except Exception as e:
            logger.warning("Strategy '%s' failed: %s", name, e)

    logger.info("Best strategy: '%s' with %d records", best_strategy, len(best))
    return best


def main() -> int:
    """Run the parse pipeline."""
    if not INPUT_FILE.exists():
        logger.error("Input file not found: %s", INPUT_FILE)
        logger.error("Run fetch_print_directory.py first.")
        return 1

    html = INPUT_FILE.read_text(encoding="utf-8")
    logger.info("Read %d bytes from %s", len(html), INPUT_FILE)

    records = parse_html(html)

    if not records:
        logger.error("No records parsed. The HTML structure may have changed.")
        logger.error("Check %s manually and update parsing strategies.", INPUT_FILE)
        return 1

    # Deduplicate by (cpl_code, test_name) — keep first occurrence
    seen: set[tuple[str, str]] = set()
    unique: list[dict[str, str]] = []
    for r in records:
        key = (r["cpl_code"], r["test_name"])
        if key not in seen:
            seen.add(key)
            unique.append(r)

    logger.info("Deduplicated: %d → %d unique records", len(records), len(unique))

    # Write CSV
    with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(unique)

    # Stats
    high = sum(1 for r in unique if r["parse_confidence"] == "high")
    medium = sum(1 for r in unique if r["parse_confidence"] == "medium")
    low = sum(1 for r in unique if r["parse_confidence"] == "low")
    logger.info(
        "Wrote %d records to %s (confidence: %d high, %d medium, %d low)",
        len(unique), OUTPUT_FILE, high, medium, low,
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
