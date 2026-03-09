# CPL Lab Code Extractor

Extract lab test codes from CPL's (Clinical Pathology Laboratories) online test directory and produce structured data for import into our Supabase database.

## Pipeline Overview

```
fetch_print_directory.py  →  data/cpl_raw.html
parse_print_directory.py  →  data/cpl_tests_raw.csv
normalize_cpl_catalog.py  →  data/cpl_tests_normalized.csv
match_to_db.py            →  data/cpl_matched.csv + data/cpl_unmatched.csv
build_review_queue.py     →  data/cpl_tests_review_queue.csv
generate_import_sql.py    →  data/cpl_import.sql + data/cpl_import_summary.json
```

## Setup

```bash
cd tools/cpl-extractor

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers (only needed if direct HTTP fetch fails)
playwright install chromium

# Configure Supabase access (needed for steps 4-6)
cp .env.example .env
# Edit .env and add your SUPABASE_SERVICE_ROLE_KEY
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | For DB matching | Service role key for Supabase access |

## Running

### Full pipeline
```bash
./run.sh
```

### Skip fetch (reuse existing HTML)
```bash
./run.sh --skip-fetch
```

### Parse only (no DB connection needed)
```bash
./run.sh --parse-only
```

### Individual steps
```bash
python3 fetch_print_directory.py
python3 parse_print_directory.py
python3 normalize_cpl_catalog.py
python3 match_to_db.py
python3 build_review_queue.py
python3 generate_import_sql.py
```

## Output Files

| File | Description |
|------|-------------|
| `data/cpl_raw.html` | Raw HTML from CPL directory |
| `data/cpl_tests_raw.csv` | Parsed test records |
| `data/cpl_tests_normalized.csv` | Cleaned + normalized records |
| `data/cpl_matched.csv` | Tests matched to our DB |
| `data/cpl_unmatched.csv` | Tests with no DB match |
| `data/cpl_tests_review_queue.csv` | Records needing human review |
| `data/cpl_import.sql` | SQL INSERT statements (high-confidence only) |
| `data/cpl_import_summary.json` | Pipeline stats |
| `data/errors.log` | Malformed records and warnings |

## Applying the Import

After reviewing the output:

```bash
# Review the SQL first
cat data/cpl_import.sql

# Apply to database
psql $DATABASE_URL < data/cpl_import.sql
```

## Manual HTML Fallback

If the automated fetch fails (JS-heavy page, CAPTCHA, etc.):

1. Open https://pgms.sonichealthcareusa.com/Common/TCM/cpl/ in a browser
2. Click the "Print" button
3. Save the rendered HTML as `data/cpl_raw.html`
4. Run: `./run.sh --skip-fetch`

## Architecture

- **Deterministic parsing** — no LLM calls, pure regex + BeautifulSoup
- **Multi-strategy parser** — tries table, card, definition list, and free-text extraction
- **Fuzzy matching** — uses thefuzz (Levenshtein) for name matching
- **CPT code matching** — exact 5-digit CPT code cross-reference
- **Confidence scoring** — every record gets a parse and match confidence level
- **Duplicate detection** — flags duplicates while preserving clinically distinct tests (e.g., Free T4 vs Total T4)
