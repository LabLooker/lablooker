#!/usr/bin/env python3
"""Step 1: Fetch the CPL printable test directory.

Tries a direct HTTP fetch first. If the page is JS-rendered,
falls back to Playwright to click the Print button and capture
the rendered HTML.

Output: data/cpl_raw.html
"""

from __future__ import annotations

import sys
import time
from pathlib import Path

import requests

from utils.helpers import DATA_DIR, setup_logging

logger = setup_logging("fetch")

BASE_URL = "https://pgms.sonichealthcareusa.com/Common/TCM/cpl/"

# URLs to try for the printable directory (in order of preference)
PRINT_URLS = [
    "https://pgms.sonichealthcareusa.com/Common/TCM/cpl/Print",
    "https://pgms.sonichealthcareusa.com/Common/TCM/cpl/?print=true",
    "https://pgms.sonichealthcareusa.com/Common/TCM/cpl/print",
    BASE_URL,
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
}

OUTPUT_FILE = DATA_DIR / "cpl_raw.html"


def fetch_with_requests(url: str, *, max_retries: int = 3) -> str | None:
    """Attempt a direct HTTP GET with retries."""
    for attempt in range(1, max_retries + 1):
        try:
            logger.info("GET %s (attempt %d/%d)", url, attempt, max_retries)
            resp = requests.get(url, headers=HEADERS, timeout=60)
            resp.raise_for_status()

            html = resp.text
            # Sanity check: the HTML should contain test data, not just a JS shell
            if len(html) < 5_000:
                logger.warning("Response too short (%d bytes) — likely a JS shell", len(html))
                return None

            # Look for indicators that actual test data is present
            lower = html.lower()
            has_test_data = any(
                marker in lower
                for marker in ["cpt", "specimen", "test name", "test code", "methodology"]
            )
            if not has_test_data:
                logger.warning("Response lacks test data markers — may need JS rendering")
                return None

            logger.info("Direct fetch successful: %d bytes", len(html))
            return html

        except requests.RequestException as e:
            logger.warning("Request failed: %s", e)
            if attempt < max_retries:
                wait = 2 ** attempt
                logger.info("Retrying in %ds...", wait)
                time.sleep(wait)

    return None


def fetch_with_playwright() -> str | None:
    """Use Playwright to render the page and extract full HTML.

    Navigates to the base URL, looks for a Print button,
    clicks it, and captures the rendered content.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        logger.error("Playwright not installed. Run: pip install playwright && playwright install chromium")
        return None

    logger.info("Falling back to Playwright for JS-rendered content...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=HEADERS["User-Agent"],
            viewport={"width": 1920, "height": 1080},
        )
        page = context.new_page()

        try:
            # Load the main directory page
            logger.info("Navigating to %s", BASE_URL)
            page.goto(BASE_URL, wait_until="networkidle", timeout=60_000)
            page.wait_for_timeout(3_000)  # Let any lazy-loaded content settle

            # Look for a Print button and click it
            print_selectors = [
                "button:has-text('Print')",
                "a:has-text('Print')",
                "[onclick*='print']",
                "#printButton",
                ".print-button",
                "button:has-text('Print Directory')",
                "a:has-text('Print Directory')",
            ]

            clicked = False
            for selector in print_selectors:
                try:
                    el = page.locator(selector).first
                    if el.is_visible(timeout=2_000):
                        logger.info("Found print trigger: %s", selector)
                        el.click()
                        page.wait_for_timeout(5_000)
                        clicked = True
                        break
                except Exception:
                    continue

            if not clicked:
                logger.info("No print button found — capturing current page content")

            # Wait for content to load
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(2_000)

            # If a new page/tab was opened (print preview), switch to it
            pages = context.pages
            target_page = pages[-1] if len(pages) > 1 else page

            html = target_page.content()
            logger.info("Playwright captured %d bytes", len(html))

            if len(html) < 5_000:
                logger.warning("Playwright content too short (%d bytes)", len(html))
                return None

            return html

        except Exception as e:
            logger.error("Playwright error: %s", e)
            return None

        finally:
            browser.close()


def main() -> int:
    """Run the fetch pipeline."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    html: str | None = None

    # Strategy 1: Try direct HTTP fetch on each print URL
    for url in PRINT_URLS:
        html = fetch_with_requests(url)
        if html:
            break

    # Strategy 2: Use Playwright if direct fetch failed
    if not html:
        html = fetch_with_playwright()

    if not html:
        logger.error("All fetch strategies failed. Cannot proceed.")
        logger.error(
            "Manual fallback: Open %s in a browser, click Print, "
            "save the rendered HTML to %s",
            BASE_URL,
            OUTPUT_FILE,
        )
        return 1

    # Save raw HTML
    OUTPUT_FILE.write_text(html, encoding="utf-8")
    logger.info("Saved raw HTML to %s (%d bytes)", OUTPUT_FILE, len(html))

    return 0


if __name__ == "__main__":
    sys.exit(main())
