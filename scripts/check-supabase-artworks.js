import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function parseEnv(filePath) {
  const result = {};
  try {
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (!match) continue;
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, '');
      result[key] = value;
    }
  } catch {
    // Ignore missing files.
  }
  return result;
}

const envLocal = parseEnv(resolve(process.cwd(), '.env.local'));
const env = parseEnv(resolve(process.cwd(), '.env'));

const supabaseUrl = envLocal.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const anonKey =
  envLocal.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  envLocal.VITE_SUPABASE_PUBLISHABLE_KEY ||
  envLocal.VITE_SUPABASE_ANON_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Missing Supabase URL or anon key in .env/.env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function run() {
  console.log('Project URL:', supabaseUrl);

  const artworks = await supabase.from('artworks').select('id,title,price', { count: 'exact' }).limit(5);
  const categories = await supabase.from('painting_categories').select('id,name', { count: 'exact' }).limit(5);

  console.log('\nartworks error:', artworks.error ? artworks.error.message : null);
  console.log('artworks count:', artworks.count);
  console.log('artworks sample rows:', artworks.data || []);

  console.log('\npainting_categories error:', categories.error ? categories.error.message : null);
  console.log('painting_categories count:', categories.count);
  console.log('painting_categories sample rows:', categories.data || []);
}

run().catch((err) => {
  console.error('Unexpected diagnostic error:', err);
  process.exit(1);
});
