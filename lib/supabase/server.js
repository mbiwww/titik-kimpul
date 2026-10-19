import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL || "";
  // Bersihkan path /rest/v1 dan trailing slash jika terikut
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/**
 * Membuat client Supabase di sisi server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca katalog dan detail produk (melewati RLS).
 */
export function buatKoneksiServer() {
  const url = getSupabaseUrl();
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur di environment variable."
    );
  }

  return createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const createServerClient = buatKoneksiServer;

