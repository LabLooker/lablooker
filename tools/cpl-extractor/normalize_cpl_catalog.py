#!/usr/bin/env python3
"""Step 3: Clean and normalize the raw parsed CPL data.

Reads data/cpl_tests_raw.csv, applies normalization rules, flags duplicates.
Does NOT collapse clinically meaningful distinctions.

Output: data/cpl_tests_normalized.csv
"""

from __future__ import annotations

import csv
import re
import sys

from utils.helpers import (
    DATA_DIR,
    normalize_container,
    normalize_name,
    normalize_specimen,
    parse_cpt_codes,
    setup_logging,
    strip_test_name,
)

logger = setup_logging("normalize")

INPUT_FILE = DATA_DIR / "cpl_tests_raw.csv"
OUTPUT_FILE = DATA_DIR / "cpl_tests_normalized.csv"

FIELDNAMES = [
    "cpl_code",
    "test_name",
    "normalized_name",
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
    "is_duplicate",
    "duplicate_of",
]


def normalize_cpt_field(raw: str) -> str:
    """Re-parse and clean CPT codes from the raw field."""
    codes = parse_cpt_codes(raw.replace(";", " "))
    return ";".join(codes)


def normalize_volume(raw: str) -> str:
    """Normalize volume strings."""
    if not raw:
        return ""
    # Standardize units
    text = raw.strip()
    text = re.sub(r"(?i)\bml\b", "mL", text)
    text = re.sub(r"(?i)\bul\b", "µL", text)
    text = re.sub(r"(?i)\bcc\b", "mL", text)
    return text


def normalize_turnaround(raw: str) -> str:
    """Normalize turnaround time strings."""
    if not raw:
        return ""
    text = raw.strip()
    # Normalize dashes
    text = text.replace("–", "-").replace("—", "-")
    # Standardize "days" / "hours"
    text = re.sub(r"(?i)\bday\b", "days", text)
    text = re.sub(r"(?i)\bhrs?\b", "hours", text)
    text = re.sub(r"(?i)\bbus(?:iness)?\s*days?\b", "business days", text)
    return text


def main() -> int:
    """Run the normalization pipeline."""
    if not INPUT_FILE.exists():
        logger.error("Input file not found: %s", INPUT_FILE)
        logger.error("Run parse_print_directory.py first.")
        return 1

    # Read raw records
    with INPUT_FILE.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        raw_records = list(reader)

    logger.info("Read %d raw records from %s", len(raw_records), INPUT_FILE)

    # Normalize each record
    normalized: list[dict[str, str]] = []
    for row in raw_records:
        try:
            record: dict[str, str] = {}
            record["cpl_code"] = row.get("cpl_code", "").strip()
            record["test_name"] = normalize_name(row.get("test_name", ""))
            record["normalized_name"] = strip_test_name(record["test_name"])
            record["aliases"] = row.get("aliases", "").strip()
            record["cpt_codes"] = normalize_cpt_field(row.get("cpt_codes", ""))
            record["specimen_type"] = normalize_specimen(row.get("specimen_type", ""))
            record["container"] = normalize_container(row.get("container", ""))
            record["volume"] = normalize_volume(row.get("volume", ""))
            record["methodology"] = row.get("methodology", "").strip()
            record["turnaround_time"] = normalize_turnaround(row.get("turnaround_time", ""))
            record["reference_range"] = row.get("reference_range", "").strip()
            record["notes"] = row.get("notes", "").strip()
            record["parse_confidence"] = row.get("parse_confidence", "low")
            record["is_duplicate"] = "false"
            record["duplicate_of"] = ""

            # Skip records with no usable data
            if not record["test_name"] and not record["cpl_code"]:
                logger.warning("Skipping record with no name or code: %s", row)
                continue

            normalized.append(record)

        except Exception as e:
            logger.warning("Error normalizing record %s: %s", row.get("cpl_code", "?"), e)

    # Flag duplicates — same normalized name but different codes
    # Keep the first occurrence, flag others
    name_to_first: dict[str, int] = {}
    for i, rec in enumerate(normalized):
        key = rec["normalized_name"]
        if not key:
            continue

        if key in name_to_first:
            first_idx = name_to_first[key]
            first = normalized[first_idx]

            # Check if this is clinically distinct (different CPT codes)
            first_cpts = set(first["cpt_codes"].split(";")) if first["cpt_codes"] else set()
            this_cpts = set(rec["cpt_codes"].split(";")) if rec["cpt_codes"] else set()

            if first_cpts and this_cpts and first_cpts != this_cpts:
                # Different CPT codes → clinically distinct, NOT a duplicate
                logger.info(
                    "Keeping distinct: '%s' (CPTs %s) vs '%s' (CPTs %s)",
                    rec["test_name"], rec["cpt_codes"],
                    first["test_name"], first["cpt_codes"],
                )
                continue

            # Same or unknown CPTs → flag as potential duplicate
            rec["is_duplicate"] = "true"
            rec["duplicate_of"] = first["cpl_code"] or first["test_name"]
        else:
            name_to_first[key] = i

    # Also flag duplicates by CPL code
    code_seen: dict[str, int] = {}
    for i, rec in enumerate(normalized):
        code = rec["cpl_code"]
        if not code:
            continue
        if code in code_seen:
            first_idx = code_seen[code]
            rec["is_duplicate"] = "true"
            rec["duplicate_of"] = normalized[first_idx]["test_name"]
        else:
            code_seen[code] = i

    # Stats
    dupes = sum(1 for r in normalized if r["is_duplicate"] == "true")
    logger.info("Flagged %d potential duplicates out of %d records", dupes, len(normalized))

    # Write output
    with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(normalized)

    logger.info("Wrote %d normalized records to %s", len(normalized), OUTPUT_FILE)
    return 0


if __name__ == "__main__":
    sys.exit(main())
