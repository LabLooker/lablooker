#!/usr/bin/env python3
"""Step 6: Generate SQL INSERT statements for high-confidence matches.

Reads data/cpl_matched.csv and generates SQL for the lab_codes table.
Only includes high-confidence matches (exact or high).

Also generates data/cpl_import_summary.json with pipeline stats.

Output: data/cpl_import.sql, data/cpl_import_summary.json
"""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timezone

from utils.helpers import DATA_DIR, setup_logging

logger = setup_logging("import_sql")

MATCHED_FILE = DATA_DIR / "cpl_matched.csv"
NORMALIZED_FILE = DATA_DIR / "cpl_tests_normalized.csv"
RAW_FILE = DATA_DIR / "cpl_tests_raw.csv"
REVIEW_FILE = DATA_DIR / "cpl_tests_review_queue.csv"
SQL_FILE = DATA_DIR / "cpl_import.sql"
SUMMARY_FILE = DATA_DIR / "cpl_import_summary.json"

LAB_NAME = "CPL"


def escape_sql(value: str) -> str:
    """Escape a string for SQL single quotes."""
    return value.replace("'", "''")


def main() -> int:
    """Generate import SQL and summary."""
    if not MATCHED_FILE.exists():
        logger.error("Matched file not found: %s", MATCHED_FILE)
        logger.error("Run match_to_db.py first.")
        return 1

    # Read matched records
    with MATCHED_FILE.open("r", encoding="utf-8") as f:
        matched = list(csv.DictReader(f))

    # Filter to high-confidence matches only
    importable = [
        r for r in matched
        if r.get("match_confidence") in ("exact", "high")
        and r.get("cpl_code")  # Must have a CPL code
        and r.get("db_test_id")  # Must have a DB test ID
    ]

    # Further filter to new codes only (not already in DB)
    new_imports = [r for r in importable if r.get("is_new_code") == "true"]

    logger.info(
        "Matched: %d total, %d high-confidence, %d new codes",
        len(matched), len(importable), len(new_imports),
    )

    # Generate SQL
    lines: list[str] = [
        "-- CPL Lab Code Import",
        f"-- Generated: {datetime.now(timezone.utc).isoformat()}",
        f"-- Source: CPL (Clinical Pathology Laboratories) test directory",
        f"-- High-confidence matches only (exact + high)",
        f"-- New codes: {len(new_imports)} (skipping {len(importable) - len(new_imports)} already in DB)",
        "",
        "BEGIN;",
        "",
    ]

    for rec in new_imports:
        test_id = escape_sql(rec["db_test_id"])
        code = escape_sql(rec["cpl_code"])
        cpl_name = escape_sql(rec.get("cpl_name", ""))
        db_name = escape_sql(rec.get("db_test_name", ""))
        confidence = rec.get("match_confidence", "")
        score = rec.get("fuzzy_score", "")

        lines.append(
            f"INSERT INTO lab_codes (test_id, lab_name, proprietary_code, code_type, notes)"
            f"\n  VALUES ("
            f"\n    '{test_id}',"
            f"\n    '{LAB_NAME}',"
            f"\n    '{code}',"
            f"\n    'order_code',"
            f"\n    'CPL: {cpl_name} | match: {confidence} (score {score}) → {db_name}'"
            f"\n  )"
            f"\n  ON CONFLICT (test_id, lab_name, proprietary_code) DO NOTHING;"
        )
        lines.append("")

    lines.append("COMMIT;")
    lines.append("")

    SQL_FILE.write_text("\n".join(lines), encoding="utf-8")
    logger.info("Wrote %d INSERT statements to %s", len(new_imports), SQL_FILE)

    # ── Generate summary ──────────────────────────────────────────────────────

    # Count raw records
    total_raw = 0
    if RAW_FILE.exists():
        with RAW_FILE.open("r", encoding="utf-8") as f:
            total_raw = sum(1 for _ in csv.DictReader(f))

    # Count normalized records
    total_normalized = 0
    if NORMALIZED_FILE.exists():
        with NORMALIZED_FILE.open("r", encoding="utf-8") as f:
            total_normalized = sum(1 for _ in csv.DictReader(f))

    # Count review queue
    total_review = 0
    if REVIEW_FILE.exists():
        with REVIEW_FILE.open("r", encoding="utf-8") as f:
            total_review = sum(1 for _ in csv.DictReader(f))

    summary = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_tests_found": total_raw,
        "total_parsed_successfully": total_normalized,
        "total_matched_to_db": len(matched),
        "total_high_confidence_matches": len(importable),
        "total_new_codes": len(new_imports),
        "total_already_in_db": len(importable) - len(new_imports),
        "total_unmatched": total_normalized - len(matched),
        "total_review_needed": total_review,
        "confidence_breakdown": {
            "exact": sum(1 for r in matched if r.get("match_confidence") == "exact"),
            "high": sum(1 for r in matched if r.get("match_confidence") == "high"),
            "medium": sum(1 for r in matched if r.get("match_confidence") == "medium"),
        },
        "output_files": {
            "raw_html": "data/cpl_raw.html",
            "raw_csv": "data/cpl_tests_raw.csv",
            "normalized_csv": "data/cpl_tests_normalized.csv",
            "matched_csv": "data/cpl_matched.csv",
            "unmatched_csv": "data/cpl_unmatched.csv",
            "review_queue": "data/cpl_tests_review_queue.csv",
            "import_sql": "data/cpl_import.sql",
        },
    }

    SUMMARY_FILE.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    logger.info("Summary written to %s", SUMMARY_FILE)

    # Print summary
    logger.info("─── Pipeline Summary ───")
    logger.info("  Tests found:       %d", summary["total_tests_found"])
    logger.info("  Parsed OK:         %d", summary["total_parsed_successfully"])
    logger.info("  Matched to DB:     %d", summary["total_matched_to_db"])
    logger.info("  High-confidence:   %d", summary["total_high_confidence_matches"])
    logger.info("  New codes:         %d", summary["total_new_codes"])
    logger.info("  Already in DB:     %d", summary["total_already_in_db"])
    logger.info("  Need review:       %d", summary["total_review_needed"])

    return 0


if __name__ == "__main__":
    sys.exit(main())
