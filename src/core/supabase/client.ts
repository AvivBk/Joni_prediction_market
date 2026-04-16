import { createClient, type SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  workflowId: string;
}

let _client: SupabaseClient | null = null;
let _config: SupabaseConfig | null = null;
let _configPromise: Promise<SupabaseConfig> | null = null;

export async function getSupabaseConfig(): Promise<SupabaseConfig> {
  if (_config) return _config;
  if (_configPromise) return _configPromise;

  _configPromise = fetch('/supabase-config.json')
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(
          'supabase-config.json not found. Ensure inject-supabase-to-template.cjs ran before deployment.',
        );
      }
      const config = (await res.json()) as SupabaseConfig;
      _config = config;
      return config;
    })
    .catch((err) => {
      _configPromise = null;
      throw err;
    });

  return _configPromise;
}

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (_client) return _client;
  const config = await getSupabaseConfig();
  _client = createClient(config.url, config.anonKey, {
    auth: { persistSession: false },
  });
  return _client;
}

export async function getSiteWorkflowId(): Promise<string> {
  const config = await getSupabaseConfig();
  return config.workflowId;
}
