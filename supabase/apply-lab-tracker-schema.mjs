/**
 * Lab Tracker Schema Migration Script
 *
 * This attempts to apply lab-tracker-schema.sql via the Supabase Management API.
 * The project ref is: cbeazeiehgiwhklxtdir
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=<your-personal-access-token> node supabase/apply-lab-tracker-schema.mjs
 *
 * If you don't have a personal access token:
 *   1. Go to https://supabase.com/dashboard/account/tokens
 *   2. Create a new token
 *   3. Run: SUPABASE_ACCESS_TOKEN=<token> node supabase/apply-lab-tracker-schema.mjs
 *
 * OR: Apply manually at:
 *   https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new
 *   (paste the contents of supabase/lab-tracker-schema.sql)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = 'cbeazeiehgiwhklxtdir';
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN environment variable');
  console.error('   Get one at: https://supabase.com/dashboard/account/tokens');
  console.error('   Then run: SUPABASE_ACCESS_TOKEN=<token> node supabase/apply-lab-tracker-schema.mjs');
  process.exit(1);
}

const sqlFile = path.join(__dirname, 'lab-tracker-schema.sql');
const sql = fs.readFileSync(sqlFile, 'utf-8');

async function applySchema() {
  console.log('🚀 Applying Lab Tracker schema to Supabase...');

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('❌ Failed to apply schema via Management API:', data);
    console.error('\n📋 Manual fallback:');
    console.error('   1. Go to https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new');
    console.error('   2. Paste the contents of supabase/lab-tracker-schema.sql');
    console.error('   3. Click "Run"');
    process.exit(1);
  }

  console.log('✅ Schema applied successfully!');
  console.log(data);
}

applySchema().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
