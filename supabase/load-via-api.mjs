#!/usr/bin/env node
// Load all lab data via Supabase REST API (no psql needed)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cbeazeiehgiwhklxtdir.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Step 1: Fetch all tests to build name→id map
console.log('Fetching existing tests...');
const { data: tests, error: tErr } = await supabase.from('tests').select('id, test_name');
if (tErr) { console.error('Failed to fetch tests:', tErr); process.exit(1); }
console.log(`Found ${tests.length} tests`);

// Build lookup: lowercase patterns → test id
function findTest(patterns) {
  for (const t of tests) {
    const name = t.test_name.toLowerCase();
    for (const p of patterns) {
      if (p.includes('%')) {
        // Convert SQL LIKE to regex
        const re = new RegExp(p.replace(/%/g, '.*'), 'i');
        if (re.test(name)) return t.id;
      } else if (name.includes(p)) return t.id;
    }
  }
  return null;
}

// Parse the SQL file to extract data
import { readFileSync } from 'fs';
const rawSql = readFileSync('/home/mightyyeti/lablooker/supabase/load-all-new-data.sql', 'utf8');
// Join continuation lines (lines not starting with INSERT, --, or blank)
const sql = rawSql.replace(/\n(?!INSERT|--|$)/g, ' ');

// Extract lab_codes inserts
const labCodeRows = [];
const lcRegex = /INSERT INTO lab_codes.*?'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'.*?WHERE\s+(.*?)\s*(?:ON CONFLICT|LIMIT)/gs;
// Simpler approach: parse line by line
const lines = sql.split('\n');
let labCodesCount = 0;
let pricingCount = 0;
let labsCount = 0;

// Parse lab_codes
const labCodeInserts = [];
for (const line of lines) {
  const m = line.match(/INSERT INTO lab_codes.*?SELECT t\.id,\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']*)'.*?WHERE\s+(.*?)\s*ON CONFLICT/i);
  if (m) {
    const [, lab_name, code, code_type, notes, whereClause] = m;
    // Extract LIKE patterns from WHERE
    const patterns = [];
    const likeMatches = whereClause.matchAll(/LIKE\s+'([^']+)'/gi);
    for (const lm of likeMatches) patterns.push(lm[1].replace(/%/g, ''));
    const testId = findTest(patterns);
    if (testId) {
      labCodeInserts.push({ test_id: testId, lab_name, proprietary_code: code, code_type, notes });
    }
  }
}

console.log(`Parsed ${labCodeInserts.length} lab_code rows`);

// Insert lab_codes in batches
const batchSize = 50;
for (let i = 0; i < labCodeInserts.length; i += batchSize) {
  const batch = labCodeInserts.slice(i, i + batchSize);
  const { error } = await supabase.from('lab_codes').upsert(batch, { onConflict: 'test_id,lab_name,proprietary_code', ignoreDuplicates: true });
  if (error) {
    // Try individual inserts for this batch
    let ok = 0, skip = 0;
    for (const row of batch) {
      const { error: e2 } = await supabase.from('lab_codes').insert(row);
      if (e2) skip++; else ok++;
    }
    console.log(`  Batch ${Math.floor(i/batchSize)}: ${ok} inserted, ${skip} skipped`);
  } else {
    console.log(`  Batch ${Math.floor(i/batchSize)}: ${batch.length} upserted`);
  }
  labCodesCount += batch.length;
}

// Parse and insert DTC labs
const labsInsertMatch = sql.match(/INSERT INTO labs \(id.*?VALUES\n([\s\S]*?)ON CONFLICT/);
if (labsInsertMatch) {
  const labRows = [];
  const labLines = labsInsertMatch[1].matchAll(/\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']*)',\s*'([^']*)'\)/g);
  for (const lm of labLines) {
    labRows.push({
      id: lm[1], lab_name: lm[2], website: lm[3],
      ordering_type: lm[4], uses_network: lm[5], notes: lm[6]
    });
  }
  if (labRows.length > 0) {
    const { error } = await supabase.from('labs').upsert(labRows, { onConflict: 'id', ignoreDuplicates: true });
    if (error) {
      console.log('Labs insert error:', error.message);
      // Try one by one
      for (const row of labRows) {
        const { error: e2 } = await supabase.from('labs').insert(row);
        if (!e2) labsCount++;
      }
    } else {
      labsCount = labRows.length;
    }
    console.log(`Inserted ${labsCount} DTC lab providers`);
  }
}

// Parse pricing inserts
const pricingInserts = [];
for (const line of lines) {
  const m = line.match(/INSERT INTO pricing.*?SELECT t\.id,\s*'([^']+)'::uuid,\s*([\d.]+),\s*(true|false).*?WHERE\s+(.*?)\s*LIMIT/i);
  if (m) {
    const [, lab_id, price, requires_rx, whereClause] = m;
    const patterns = [];
    const likeMatches = whereClause.matchAll(/LIKE\s+'([^']+)'/gi);
    for (const lm of likeMatches) patterns.push(lm[1].replace(/%/g, ''));
    const testId = findTest(patterns);
    if (testId) {
      pricingInserts.push({ test_id: testId, lab_id, price: parseFloat(price), requires_rx: requires_rx === 'true' });
    }
  }
}

console.log(`Parsed ${pricingInserts.length} pricing rows`);

for (let i = 0; i < pricingInserts.length; i += batchSize) {
  const batch = pricingInserts.slice(i, i + batchSize);
  const { error } = await supabase.from('pricing').upsert(batch, { onConflict: 'test_id,lab_id', ignoreDuplicates: true });
  if (error) {
    let ok = 0, skip = 0;
    for (const row of batch) {
      const { error: e2 } = await supabase.from('pricing').insert(row);
      if (e2) skip++; else ok++;
    }
    console.log(`  Pricing batch ${Math.floor(i/batchSize)}: ${ok} inserted, ${skip} skipped`);
  } else {
    console.log(`  Pricing batch ${Math.floor(i/batchSize)}: ${batch.length} upserted`);
  }
  pricingCount += batch.length;
}

console.log('\n=== DONE ===');
console.log(`Lab codes: ${labCodeInserts.length} processed`);
console.log(`Labs: ${labsCount} providers`);
console.log(`Pricing: ${pricingInserts.length} rows`);
