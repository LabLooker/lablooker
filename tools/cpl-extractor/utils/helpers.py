"""Shared utilities for CPL extractor pipeline.

Name normalization, CPT parsing, confidence scoring, and logging helpers.
"""

from __future__ import annotations

import logging
import os
import re
import unicodedata
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
ERROR_LOG = DATA_DIR / "errors.log"

# ── Logging ───────────────────────────────────────────────────────────────────


def setup_logging(name: str, *, level: int = logging.INFO) -> logging.Logger:
    """Configure a logger that writes to console and data/errors.log."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(name)
    logger.setLevel(level)

    if not logger.handlers:
        fmt = logging.Formatter(
            "%(asctime)s [%(name)s] %(levelname)s: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )

        # Console handler — INFO+
        ch = logging.StreamHandler()
        ch.setLevel(logging.INFO)
        ch.setFormatter(fmt)
        logger.addHandler(ch)

        # File handler — WARNING+ (malformed records, errors)
        fh = logging.FileHandler(ERROR_LOG, encoding="utf-8")
        fh.setLevel(logging.WARNING)
        fh.setFormatter(fmt)
        logger.addHandler(fh)

    return logger


# ── Name normalization ────────────────────────────────────────────────────────

# Canonical casing for well-known abbreviations/terms
_KNOWN_UPPER = {
    "tsh", "hba1c", "a1c", "cbc", "cmp", "bmp", "ldl", "hdl", "vldl",
    "ast", "alt", "ggt", "esr", "crp", "psa", "dna", "rna", "pcr",
    "hiv", "hcv", "hbv", "hpv", "cmv", "ebv", "hsv", "rbc", "wbc",
    "mcv", "mch", "mchc", "rdw", "mpv", "plt", "pt", "ptt", "inr",
    "aptt", "bhcg", "dhea", "shbg", "igf", "ige", "igg", "iga", "igm",
    "ana", "anca", "gfr", "egfr", "bun", "co2", "t3", "t4", "ft3",
    "ft4", "lh", "fsh", "acth", "adh", "bnp", "ck", "ldh", "afp",
    "cea", "ca", "hgb", "hct", "sed", "epo", "tpo", "tg", "anti",
    "tibc", "uibc", "ferr", "folate", "b12", "d3", "oh", "cpt",
}

# Words that should stay lowercase (unless at the start of a name)
_LOWERCASE_WORDS = {"of", "and", "or", "the", "in", "by", "for", "with", "to", "a", "an", "on", "at"}


def normalize_name(raw: str) -> str:
    """Normalize a test name: strip extra whitespace, fix casing, normalize unicode."""
    if not raw:
        return ""

    # Normalize unicode (e.g., curly quotes → straight quotes)
    text = unicodedata.normalize("NFKD", raw)

    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # Remove leading/trailing punctuation noise
    text = text.strip(".,;: ")

    # Title case with special handling
    words = text.split()
    result: list[str] = []
    for i, word in enumerate(words):
        clean = re.sub(r"[^a-zA-Z0-9]", "", word).lower()
        if clean in _KNOWN_UPPER:
            # Preserve non-alpha chars but uppercase the letters
            result.append(re.sub(r"[a-zA-Z]+", lambda m: m.group().upper(), word))
        elif i > 0 and clean in _LOWERCASE_WORDS:
            result.append(word.lower())
        else:
            # Title case each word
            result.append(word[0].upper() + word[1:] if word else word)
    return " ".join(result)


def strip_test_name(raw: str) -> str:
    """Aggressively strip a test name for matching purposes.

    Returns lowercase, alphanumeric only, common synonyms collapsed.
    """
    if not raw:
        return ""
    text = raw.lower()
    # Remove parenthetical qualifiers
    text = re.sub(r"\(.*?\)", "", text)
    # Remove common noise words
    for noise in [
        "test", "assay", "panel", "profile", "screen", "screening",
        "quantitative", "qualitative", "serum", "plasma", "blood",
        "urine", "random", "specimen", "level", "levels",
    ]:
        text = re.sub(rf"\b{noise}\b", "", text)
    # Keep only alphanumeric
    text = re.sub(r"[^a-z0-9]", "", text)
    return text.strip()


# ── CPT code parsing ─────────────────────────────────────────────────────────

_CPT_PATTERN = re.compile(r"\b(\d{5})\b")


def parse_cpt_codes(raw: str) -> list[str]:
    """Extract valid CPT codes (5-digit) from a raw string."""
    if not raw:
        return []
    codes = _CPT_PATTERN.findall(raw)
    # Deduplicate while preserving order
    seen: set[str] = set()
    result: list[str] = []
    for code in codes:
        if code not in seen:
            seen.add(code)
            result.append(code)
    return result


# ── Specimen type normalization ───────────────────────────────────────────────

_SPECIMEN_MAP: dict[str, str] = {
    "serum": "Serum",
    "ser": "Serum",
    "plasma": "Plasma",
    "plas": "Plasma",
    "whole blood": "Whole Blood",
    "wb": "Whole Blood",
    "edta": "Whole Blood (EDTA)",
    "edta whole blood": "Whole Blood (EDTA)",
    "urine": "Urine",
    "ur": "Urine",
    "random urine": "Urine (Random)",
    "24 hour urine": "Urine (24-Hour)",
    "24-hour urine": "Urine (24-Hour)",
    "24-hr urine": "Urine (24-Hour)",
    "csf": "CSF",
    "cerebrospinal fluid": "CSF",
    "stool": "Stool",
    "feces": "Stool",
    "saliva": "Saliva",
    "swab": "Swab",
    "tissue": "Tissue",
    "body fluid": "Body Fluid",
    "synovial fluid": "Synovial Fluid",
    "pleural fluid": "Pleural Fluid",
    "peritoneal fluid": "Peritoneal Fluid",
    "amniotic fluid": "Amniotic Fluid",
    "serum/plasma": "Serum/Plasma",
    "serum or plasma": "Serum/Plasma",
    "ser/plas": "Serum/Plasma",
}


def normalize_specimen(raw: str) -> str:
    """Normalize specimen type to a canonical value."""
    if not raw:
        return ""
    key = raw.strip().lower()
    # Direct match
    if key in _SPECIMEN_MAP:
        return _SPECIMEN_MAP[key]
    # Substring match (e.g., "Serum, gel tube" → "Serum")
    for pattern, canonical in _SPECIMEN_MAP.items():
        if pattern in key:
            return canonical
    # Return title-cased original if no match
    return raw.strip().title()


# ── Container normalization ───────────────────────────────────────────────────

_CONTAINER_MAP: dict[str, str] = {
    "red": "Red Top (No Additive)",
    "red top": "Red Top (No Additive)",
    "sst": "SST (Gold Top)",
    "gold": "SST (Gold Top)",
    "gold top": "SST (Gold Top)",
    "tiger top": "SST (Gold Top)",
    "lavender": "Lavender Top (EDTA)",
    "purple": "Lavender Top (EDTA)",
    "edta": "Lavender Top (EDTA)",
    "green": "Green Top (Heparin)",
    "green top": "Green Top (Heparin)",
    "lithium heparin": "Green Top (Lithium Heparin)",
    "light green": "Light Green Top (PST)",
    "blue": "Blue Top (Citrate)",
    "blue top": "Blue Top (Citrate)",
    "citrate": "Blue Top (Citrate)",
    "gray": "Gray Top (Fluoride/Oxalate)",
    "gray top": "Gray Top (Fluoride/Oxalate)",
    "yellow": "Yellow Top (ACD)",
    "yellow top": "Yellow Top (ACD)",
    "urine cup": "Urine Cup",
    "urine container": "Urine Cup",
}


def normalize_container(raw: str) -> str:
    """Normalize container/tube type."""
    if not raw:
        return ""
    key = raw.strip().lower()
    if key in _CONTAINER_MAP:
        return _CONTAINER_MAP[key]
    for pattern, canonical in _CONTAINER_MAP.items():
        if pattern in key:
            return canonical
    return raw.strip().title()


# ── Confidence scoring ────────────────────────────────────────────────────────


def score_parse_confidence(
    *,
    has_code: bool,
    has_name: bool,
    has_cpt: bool,
    has_specimen: bool,
    field_count: int,
) -> str:
    """Score parse confidence based on how many fields were extracted.

    Returns: 'high', 'medium', or 'low'.
    """
    if has_code and has_name and has_cpt and field_count >= 5:
        return "high"
    if has_code and has_name and field_count >= 3:
        return "medium"
    return "low"


def score_match_confidence(
    *,
    cpt_match: bool,
    name_exact: bool,
    name_fuzzy_score: int,
    alias_match: bool,
) -> str:
    """Score match confidence against our DB.

    Returns: 'exact', 'high', 'medium', 'low', or 'none'.
    """
    if cpt_match and name_exact:
        return "exact"
    if cpt_match and name_fuzzy_score >= 85:
        return "exact"
    if cpt_match:
        return "high"
    if name_exact or name_fuzzy_score >= 90:
        return "high"
    if name_fuzzy_score >= 75 or alias_match:
        return "medium"
    if name_fuzzy_score >= 60:
        return "low"
    return "none"


# ── Environment ───────────────────────────────────────────────────────────────


def get_env(key: str, default: str | None = None) -> str:
    """Get an environment variable, loading .env if present."""
    from dotenv import load_dotenv

    load_dotenv(ROOT_DIR / ".env")
    val = os.getenv(key, default)
    if val is None:
        raise EnvironmentError(f"Required environment variable {key} is not set")
    return val
