#!/usr/bin/env python3
"""Step 5: Match normalized CPL tests to our Supabase tests table.

Connects to Supabase, pulls all tests, and matches by:
  - Exact CPT code match
  - Fuzzy name match (using thefuzz)
  - Alias match

Output: data/cpl_matched.csv, data/cpl_unmatched.csv
"""

from __future__ import annotations

import csv
import sys
from dataclasses import dataclass

from thefuzz import fuzz

from utils.helpers import (
    DATA_DIR,
    get_env,
    score_match_confidence,
    setup_logging,
    strip_test_name,
)

logger = setup_logging("match")

SUPABASE_URL = "https://cbeazeiehgiwhklxtdir.supabase.co"
INPUT_FILE = DATA_DIR / "cpl_tests_normalized.csv"
MATCHED_FILE = DATA_DIR / "cpl_matched.csv"
UNMATCHED_FILE = DATA_DIR / "cpl_unmatched.csv"


@dataclass
class DbTest:
    """A test from our Supabase database."""
    id: str
    test_name: str
    cpt_codes: list[str]
    category: str
    stripped_name: str  # For matching


def fetch_db_tests() -> list[DbTest]:
    """Pull all tests from Supabase."""
    from supabase import create_client

    key = get_env("SUPABASE_SERVICE_ROLE_KEY")
    client = create_client(SUPABASE_URL, key)

    # Paginate through all tests
    all_tests: list[DbTest] = []
    page_size = 1000
    offset = 0

    while True:
        resp = (
            client.table("tests")
            .select("id, test_name, cpt_codes, category")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        rows = resp.data
        if not rows:
            break

        for row in rows:
            all_tests.append(DbTest(
                id=row["id"],
                test_name=row["test_name"],
                cpt_codes=row.get("cpt_codes") or [],
                category=row.get("category") or "",
                stripped_name=strip_test_name(row["test_name"]),
            ))

        if len(rows) < page_size:
            break
        offset += page_size

    logger.info("Fetched %d tests from Supabase", len(all_tests))
    return all_tests


def fetch_existing_cpl_codes() -> set[str]:
    """Fetch CPL codes already in our lab_codes table."""
    from supabase import create_client

    key = get_env("SUPABASE_SERVICE_ROLE_KEY")
    client = create_client(SUPABASE_URL, key)

    existing: set[str] = set()
    page_size = 1000
    offset = 0

    while True:
        resp = (
            client.table("lab_codes")
            .select("proprietary_code")
            .eq("lab_name", "CPL")
            .range(offset, offset + page_size - 1)
            .execute()
        )
        rows = resp.data
        if not rows:
            break

        for row in rows:
            existing.add(row["proprietary_code"])

        if len(rows) < page_size:
            break
        offset += page_size

    logger.info("Found %d existing CPL codes in lab_codes", len(existing))
    return existing


def match_test(
    cpl_record: dict[str, str],
    db_tests: list[DbTest],
    *,
    cpt_index: dict[str, list[DbTest]],
    name_index: dict[str, list[DbTest]],
) -> tuple[DbTest | None, str, int]:
    """Find the best matching DB test for a CPL record.

    Returns: (matched_test, confidence, fuzzy_score)
    """
    cpl_cpts = set(cpl_record.get("cpt_codes", "").split(";")) - {""}
    cpl_name = cpl_record.get("test_name", "")
    cpl_stripped = cpl_record.get("normalized_name", "") or strip_test_name(cpl_name)
    cpl_aliases = cpl_record.get("aliases", "")

    best_match: DbTest | None = None
    best_score = 0
    cpt_matched = False
    name_exact = False
    alias_matched = False

    # 1. CPT code match
    if cpl_cpts:
        cpt_candidates: list[DbTest] = []
        for cpt in cpl_cpts:
            if cpt in cpt_index:
                cpt_candidates.extend(cpt_index[cpt])

        if cpt_candidates:
            cpt_matched = True
            # Among CPT matches, find best name match
            for db in cpt_candidates:
                score = fuzz.token_sort_ratio(cpl_name.lower(), db.test_name.lower())
                if score > best_score:
                    best_score = score
                    best_match = db
                    if score == 100:
                        name_exact = True

    # 2. Exact name match (stripped)
    if not name_exact and cpl_stripped and cpl_stripped in name_index:
        candidates = name_index[cpl_stripped]
        for db in candidates:
            score = fuzz.token_sort_ratio(cpl_name.lower(), db.test_name.lower())
            if score > best_score:
                best_score = score
                best_match = db
                name_exact = score >= 95

    # 3. Fuzzy name match (only if no strong match yet)
    if best_score < 80:
        for db in db_tests:
            score = fuzz.token_sort_ratio(cpl_name.lower(), db.test_name.lower())
            if score > best_score:
                best_score = score
                best_match = db
                if score >= 95:
                    name_exact = True
                    break  # Good enough

    # 4. Alias match
    if best_score < 70 and cpl_aliases:
        for alias in cpl_aliases.split(";"):
            alias = alias.strip()
            if not alias:
                continue
            for db in db_tests:
                score = fuzz.token_sort_ratio(alias.lower(), db.test_name.lower())
                if score > best_score:
                    best_score = score
                    best_match = db
                    alias_matched = True

    confidence = score_match_confidence(
        cpt_match=cpt_matched,
        name_exact=name_exact,
        name_fuzzy_score=best_score,
        alias_match=alias_matched,
    )

    return best_match, confidence, best_score


MATCHED_FIELDS = [
    "cpl_code",
    "cpl_name",
    "db_test_id",
    "db_test_name",
    "match_confidence",
    "fuzzy_score",
    "cpt_codes",
    "is_new_code",
]

UNMATCHED_FIELDS = [
    "cpl_code",
    "cpl_name",
    "cpt_codes",
    "specimen_type",
    "parse_confidence",
    "best_guess_name",
    "best_guess_score",
]


def main() -> int:
    """Run the matching pipeline."""
    if not INPUT_FILE.exists():
        logger.error("Input file not found: %s", INPUT_FILE)
        logger.error("Run normalize_cpl_catalog.py first.")
        return 1

    # Read normalized CPL records
    with INPUT_FILE.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        cpl_records = list(reader)

    # Filter out duplicates — only match non-duplicate records
    cpl_records = [r for r in cpl_records if r.get("is_duplicate") != "true"]
    logger.info("Matching %d non-duplicate CPL records", len(cpl_records))

    # Fetch DB tests
    try:
        db_tests = fetch_db_tests()
        existing_codes = fetch_existing_cpl_codes()
    except Exception as e:
        logger.error("Failed to connect to Supabase: %s", e)
        logger.error("Set SUPABASE_SERVICE_ROLE_KEY environment variable.")
        return 1

    if not db_tests:
        logger.error("No tests found in the database.")
        return 1

    # Build indexes for faster matching
    cpt_index: dict[str, list[DbTest]] = {}
    for db in db_tests:
        for cpt in db.cpt_codes:
            cpt_index.setdefault(cpt, []).append(db)

    name_index: dict[str, list[DbTest]] = {}
    for db in db_tests:
        name_index.setdefault(db.stripped_name, []).append(db)

    # Match each CPL record
    matched: list[dict[str, str]] = []
    unmatched: list[dict[str, str]] = []

    for rec in cpl_records:
        try:
            db_test, confidence, score = match_test(
                rec, db_tests,
                cpt_index=cpt_index,
                name_index=name_index,
            )

            cpl_code = rec.get("cpl_code", "")

            if db_test and confidence in ("exact", "high", "medium"):
                matched.append({
                    "cpl_code": cpl_code,
                    "cpl_name": rec.get("test_name", ""),
                    "db_test_id": db_test.id,
                    "db_test_name": db_test.test_name,
                    "match_confidence": confidence,
                    "fuzzy_score": str(score),
                    "cpt_codes": rec.get("cpt_codes", ""),
                    "is_new_code": "true" if cpl_code not in existing_codes else "false",
                })
            else:
                unmatched.append({
                    "cpl_code": cpl_code,
                    "cpl_name": rec.get("test_name", ""),
                    "cpt_codes": rec.get("cpt_codes", ""),
                    "specimen_type": rec.get("specimen_type", ""),
                    "parse_confidence": rec.get("parse_confidence", ""),
                    "best_guess_name": db_test.test_name if db_test else "",
                    "best_guess_score": str(score),
                })

        except Exception as e:
            logger.warning("Error matching '%s': %s", rec.get("test_name", "?"), e)
            unmatched.append({
                "cpl_code": rec.get("cpl_code", ""),
                "cpl_name": rec.get("test_name", ""),
                "cpt_codes": rec.get("cpt_codes", ""),
                "specimen_type": rec.get("specimen_type", ""),
                "parse_confidence": rec.get("parse_confidence", ""),
                "best_guess_name": "",
                "best_guess_score": "0",
            })

    # Write results
    with MATCHED_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=MATCHED_FIELDS)
        writer.writeheader()
        writer.writerows(matched)

    with UNMATCHED_FILE.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=UNMATCHED_FIELDS)
        writer.writeheader()
        writer.writerows(unmatched)

    # Stats
    new_codes = sum(1 for r in matched if r["is_new_code"] == "true")
    exact = sum(1 for r in matched if r["match_confidence"] == "exact")
    high = sum(1 for r in matched if r["match_confidence"] == "high")
    medium = sum(1 for r in matched if r["match_confidence"] == "medium")

    logger.info("Matched: %d (exact=%d, high=%d, medium=%d)", len(matched), exact, high, medium)
    logger.info("Unmatched: %d", len(unmatched))
    logger.info("New codes (not already in DB): %d", new_codes)
    logger.info("Wrote %s and %s", MATCHED_FILE, UNMATCHED_FILE)

    return 0


if __name__ == "__main__":
    sys.exit(main())
