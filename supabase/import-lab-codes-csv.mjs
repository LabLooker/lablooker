#!/usr/bin/env node
// Import lab codes from Chekov's CSV: test_name,lab_name,proprietary_code,category
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const csvPath = process.argv[2];
if (!csvPath) { console.error('Usage: node import-lab-codes-csv.mjs <file.csv>'); process.exit(1); }

const supabase = createClient(
  'https://cbeazeiehgiwhklxtdir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch tests
const { data: tests } = await supabase.from('tests').select('id, test_name');
console.log(`DB: ${tests.length} tests`);

// Build lookup (lowercase)
const exactMap = new Map();
for (const t of tests) exactMap.set(t.test_name.toLowerCase().trim(), t.id);

function findTestId(name) {
  const n = name.toLowerCase().trim();
  // Exact
  if (exactMap.has(n)) return exactMap.get(n);
  // Partial (either direction)
  for (const [tname, id] of exactMap) {
    if (tname.includes(n) || n.includes(tname)) return id;
  }
  return null;
}

// Parse CSV
const raw = readFileSync(csvPath, 'utf-8');
const lines = raw.split('\n').filter(l => l.trim());
const rows = lines.slice(1); // skip header

let imported = 0, skippedDupe = 0, skippedNoMatch = 0, errors = 0;

for (const line of rows) {
  const parts = [];
  let current = '', inQuote = false;
  for (const ch of line) {
    if (ch === '"') { inQuote = !inQuote; continue; }
    if (ch === ',' && !inQuote) { parts.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  parts.push(current.trim());

  const [testName, labName, code, category] = parts;
  if (!testName || !labName || !code) continue;

  const testId = findTestId(testName);
  if (!testId) {
    console.log(`SKIP (no test match): "${testName}" | ${labName} | ${code}`);
    skippedNoMatch++;
    continue;
  }

  // Check for existing
  const { data: existing } = await supabase
    .from('lab_codes')
    .select('id')
    .eq('test_id', testId)
    .eq('lab_name', labName)
    .eq('proprietary_code', code)
    .limit(1);

  if (existing && existing.length > 0) {
    skippedDupe++;
    continue;
  }

  const { error } = await supabase
    .from('lab_codes')
    .insert({ test_id: testId, lab_name: labName, proprietary_code: code, code_type: 'order' });

  if (error) {
    console.log(`FAIL: ${labName} | ${testName} | ${code}: ${error.message}`);
    errors++;
  } else {
    imported++;
  }
}

console.log(`\nDone! Imported: ${imported} | Dupes: ${skippedDupe} | No match: ${skippedNoMatch} | Errors: ${errors}`);
