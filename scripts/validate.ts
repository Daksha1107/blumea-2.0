#!/usr/bin/env node

/**
 * Pre-deployment validation script
 * Checks that all critical files and configurations are in place
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

const requiredFiles = [
  '.env.example',
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.ts',
  'lib/env.ts',
  'lib/auth.ts',
  'lib/rbac.ts',
  'lib/mongodb.ts',
  'lib/sanitize.ts',
  'lib/seo.ts',
  'lib/search.ts',
  'lib/queue.ts',
  'lib/rateLimit.ts',
  'middleware.ts',
  'app/layout.tsx',
  'app/page.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'scripts/migrate.ts',
  'scripts/seed.ts',
  'scripts/seedAdmin.ts',
];

console.log('🔍 Validating project structure...\n');

let allPresent = true;

for (const file of requiredFiles) {
  const filePath = resolve(process.cwd(), file);
  const exists = existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allPresent = false;
  }
}

console.log('\n');

if (allPresent) {
  console.log('✅ All critical files are present!');
  process.exit(0);
} else {
  console.log('❌ Some critical files are missing!');
  process.exit(1);
}
