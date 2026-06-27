import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseKey,
  isConfigured: Boolean(supabaseUrl && supabaseKey),
  allowSignup: process.env.NEXT_PUBLIC_SUPABASE_ALLOW_SIGNUP === "true",
};

let browserClient;

export function getSupabaseClient() {
  if (!supabaseConfig.isConfigured) return null;

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
        storageKey: "clinicaos-auth",
      },
    });
  }

  return browserClient;
}
