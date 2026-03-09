#!/usr/bin/env bash
# CPL Lab Code Extractor — Full Pipeline
#
# Usage:
#   ./run.sh              Run full pipeline (fetch → parse → normalize → match → review → import)
#   ./run.sh --skip-fetch  Skip fetch step (reuse existing data/cpl_raw.html)
#   ./run.sh --parse-only  Only run parse + normalize (no DB connection needed)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

step() {
    echo -e "\n${BLUE}━━━ Step $1: $2 ━━━${NC}"
}

ok() {
    echo -e "${GREEN}✓ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

fail() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Parse flags
SKIP_FETCH=false
PARSE_ONLY=false
for arg in "$@"; do
    case "$arg" in
        --skip-fetch) SKIP_FETCH=true ;;
        --parse-only) PARSE_ONLY=true; SKIP_FETCH=true ;;
        --help|-h)
            echo "Usage: ./run.sh [--skip-fetch] [--parse-only]"
            echo ""
            echo "  --skip-fetch   Reuse existing data/cpl_raw.html"
            echo "  --parse-only   Only parse + normalize (no Supabase needed)"
            exit 0
            ;;
    esac
done

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CPL Lab Code Extractor Pipeline      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"

# Ensure data directory exists
mkdir -p data

# ── Step 1: Fetch ─────────────────────────────────────────────────────────────

if [ "$SKIP_FETCH" = true ]; then
    if [ -f data/cpl_raw.html ]; then
        ok "Skipping fetch (using existing data/cpl_raw.html)"
    else
        fail "No data/cpl_raw.html found. Run without --skip-fetch first."
    fi
else
    step 1 "Fetch CPL print directory"
    python3 fetch_print_directory.py || fail "Fetch failed"
    ok "Raw HTML saved to data/cpl_raw.html"
fi

# ── Step 2: Parse ─────────────────────────────────────────────────────────────

step 2 "Parse HTML into structured rows"
python3 parse_print_directory.py || fail "Parse failed"
ok "Raw CSV saved to data/cpl_tests_raw.csv"

# ── Step 3: Normalize ─────────────────────────────────────────────────────────

step 3 "Normalize and clean data"
python3 normalize_cpl_catalog.py || fail "Normalize failed"
ok "Normalized CSV saved to data/cpl_tests_normalized.csv"

if [ "$PARSE_ONLY" = true ]; then
    echo ""
    ok "Parse-only mode complete. Files in data/:"
    ls -lh data/*.csv 2>/dev/null || true
    exit 0
fi

# ── Step 4: Match to DB ──────────────────────────────────────────────────────

step 4 "Match to Supabase database"
if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
    warn "SUPABASE_SERVICE_ROLE_KEY not set. Checking .env file..."
    if [ -f .env ]; then
        export $(grep -v '^#' .env | xargs)
    fi
fi

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
    fail "SUPABASE_SERVICE_ROLE_KEY is required. Set it in .env or environment."
fi

python3 match_to_db.py || fail "Match failed"
ok "Matched/unmatched CSVs saved to data/"

# ── Step 5: Build review queue ────────────────────────────────────────────────

step 5 "Build review queue"
python3 build_review_queue.py || fail "Review queue generation failed"
ok "Review queue saved to data/cpl_tests_review_queue.csv"

# ── Step 6: Generate import SQL ───────────────────────────────────────────────

step 6 "Generate import SQL + summary"
python3 generate_import_sql.py || fail "SQL generation failed"
ok "Import SQL saved to data/cpl_import.sql"
ok "Summary saved to data/cpl_import_summary.json"

# ── Done ──────────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Pipeline complete!                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Output files:"
ls -lh data/ 2>/dev/null | grep -v "^total"
echo ""

if [ -f data/cpl_import_summary.json ]; then
    echo "Summary:"
    python3 -c "import json; d=json.load(open('data/cpl_import_summary.json')); [print(f'  {k}: {v}') for k,v in d.items() if not isinstance(v, dict)]"
fi

echo ""
echo "Next steps:"
echo "  1. Review data/cpl_tests_review_queue.csv for flagged records"
echo "  2. Inspect data/cpl_import.sql before running"
echo "  3. Apply: psql \$DATABASE_URL < data/cpl_import.sql"
