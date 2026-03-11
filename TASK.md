# TASK: Add Multi-Test Bulk Input Across Site

## Goal
Allow users to add multiple tests at once by typing or pasting comma-separated or newline-separated test names, everywhere there's a test search/add function.

## Pattern to Follow
The Translate page (`src/app/(marketing)/translate/page.tsx`) already supports multi-input. Use the same UX pattern.

## Pages to Update

### 1. Advocate Page (`src/app/(marketing)/advocate/page.tsx`) — HIGHEST PRIORITY
- Currently: single search input with dropdown, one test at a time
- Change: Allow comma-separated or newline-separated input
- When user types "TSH, ferritin, vitamin D" or pastes a list, split by commas/newlines, fuzzy-match each against the tests table, and add all matches at once
- Show unmatched items so user knows what didn't match
- Keep the existing single-search dropdown working too (backward compatible)
- Detection: if input contains a comma or newline, treat as bulk mode

### 2. Compare Page (`src/app/(marketing)/compare/page.tsx`) — MEDIUM PRIORITY  
- Currently: single search input with dropdown, selects one test for price comparison
- Change: Same bulk input pattern — paste "TSH, CBC, vitamin D" and get results for all
- The compare page only shows one test's prices at a time, so bulk input should add all to a list/queue the user can click through
- OR: if only one test is the current model, bulk input could just add the first match and show suggestions for the rest

### 3. Search Page (`src/app/(marketing)/search/page.tsx`) — NICE TO HAVE
- Currently: single search query, shows filtered results
- Change: If query contains commas, split and show results for each term grouped
- This one is lowest priority and can be simpler — just split commas and OR the search terms

## Implementation Notes
- Create a shared utility: `src/lib/bulk-test-match.ts` 
  - Takes a raw input string, splits by comma/newline
  - Queries Supabase for fuzzy matches on each term
  - Returns { matched: TestResult[], unmatched: string[] }
- Bulk detection: if input contains `,` or `\n`, activate bulk mode
- Show feedback: "Added 5 tests. 1 not found: [xyz]"
- Keep existing single-search behavior intact (no comma = normal search)

## Design System
- Colors: sage #2d6a5e, terracotta #c0826a, dark #1a2e2b, light bg #f0f7f6, border #e0ebe9
- Use existing component patterns from the codebase

## DO NOT
- Change the Translate page (it already works)
- Change the Track/dashboard pages
- Break existing single-search functionality
