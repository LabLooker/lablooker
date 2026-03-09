#!/usr/bin/env python3
"""Step 4: Generate a queue of records needing human review.

Identifies records that need manual attention:
  - Low confidence parses
  - Unmatched tests (no DB match)
  - Potential duplicates
  - Ambiguous name mappings

Output: data/cpl_tests_review_queue.csv
"""

from __future__ import annotations

import csv
import sys

from utils.helpers import DATA_DIR, setup_logging

logger = setup_logging("review")

NORMALIZED_FILE = DATA_DIR / "cpl_tests_normalized.csv"
MATCHED_FILE = DATA_DIR / "cpl_matched.csv"
UNMATCHED_FILE = DATA_DIR / "cpl_unmatched.csv"
OUTPUT_FILE = DATA_DIR / "cpl_tests_review_queue.csv"

FIELDNAMES = [
    "cpl_code",
    "cpl_name",
    "suggested_match",
    "confidence",
    "reason_flagged",
]


def main() -> int:
    """Build the review queue from normalized + matched data."""
    # Read normalized records
    if not NORMALIZED_FILE.exists():
        logger.error("Normalized file not found: %s", NORMALIZED_FILE)
        return 1

    with NORMALIZED_FILE.open("r", encoding="utf-8") as f:
        normalized = list(csv.DictReader(f))

    # Read matched records (if they exist — match_to_db may not have run yet)
    matched_map: dict[str, dict[str, str]] = {}
    if MATCHED_FILE.exists():
        with MATCHED_FILE.open("r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                matched_map[row.get("cpl_code", "")] = row

    unmatched_map: dict[str, dict[str, str]] = {}
    if UNMATCHED_FILE.exists():
        with UNMATCHED_FILE.open("r", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                unmatched_map[row.get("cpl_code", "")] = row

    logger.info(
        "Processing %d normalized, %d matched, %d unmatched records",
        len(normalized), len(matched_map), len(unmatched_map),
    )

    queue: list[dict[str, str]] = []
    seen_codes: set[str] = set()

    for rec in normalized:
        code = rec.get("cpl_code", "")
        name = rec.get("test_name", "")
        reasons: list[str] = []
        suggested = ""
        confidence = ""

        # 1. Low confidence parse
        if rec.get("parse_confidence") == "low":
            reasons.append("low_parse_confidence")

        # 2. Potential duplicate
        if rec.get("is_duplicate") == "true":
            dup_of = rec.get("duplicate_of", "")
            reasons.append(f"potential_duplicate_of:{dup_of}")

        # 3. Not matched to DB
        if code in unmatched_map:
            um = unmatched_map[code]
            reasons.append("no_db_match")
            suggested = um.get("best_guess_name", "")
            confidence = f"fuzzy_score:{um.get('best_guess_score', '0')}"
        elif code in matched_map:
            m = matched_map[code]
            match_conf = m.get("match_confidence", "")
            suggested = m.get("db_test_name", "")

            # 4. Medium confidence match — needs verification
            if match_conf == "medium":
                reasons.append("medium_confidence_match")
                confidence = f"match:{match_conf},score:{m.get('fuzzy_score', '0')}"

            # 5. Low confidence match
            elif match_conf == "low":
                reasons.append("low_confidence_match")
                confidence = f"match:{match_conf},score:{m.get('fuzzy_score', '0')}"
        else:
            # No match data at all
            if matched_map or unmatched_map:
                reasons.append("not_processed_by_matcher")

        # 6. Missing critical fields
        if not rec.get("cpl_code"):
            reasons.append("missing_code")
        if not rec.get("test_name"):
            reasons.append("missing_name")
        if not rec.get("cpt_codes"):
            reasons.append("missing_cpt")

        # Only add to queue if there are reasons to flag
        if reasons and code not in seen_codes:
            seen_codes.add(code)
            queue.append({
                "cpl_code": code,
                "cpl_name": name,
                "suggested_match": suggested,
                "confidence": confidence,
                "reason_flagged": "; ".join(reasons),
            })

    # Sort by severity: no_db_match first, then low confidence, then duplicates
    def sort_key(r: dict[str, str]) -> tuple[int, str]:
        reasons = r["reason_flagged"]
        if "no_db_match" in reasons:
            return (0, r["cpl_name"])
        if "low_confidence" in reasons:
            return (1, r["cpl_name"])
        if "medium_confidence" in reasons:
            return (2, r["cpl_name"])
        if "missing_" in reasons:
            return (3, r["cpl_name"])
        return (4, r["cpl_name"])

    queue.sort(key=sort_key)

    # Write output
    with OUTPUT_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(queue)

    logger.info("Review queue: %d records flagged for review → %s", len(queue), OUTPUT_FILE)

    # Breakdown
    reasons_count: dict[str, int] = {}
    for r in queue:
        for reason in r["reason_flagged"].split("; "):
            key = reason.split(":")[0]
            reasons_count[key] = reasons_count.get(key, 0) + 1

    for reason, count in sorted(reasons_count.items(), key=lambda x: -x[1]):
        logger.info("  %s: %d", reason, count)

    return 0


if __name__ == "__main__":
    sys.exit(main())
