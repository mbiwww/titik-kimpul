import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

/**
 * Membuat client Supabase sesi admin menggunakan @supabase/ssr dan cookies.
 * Menggunakan SUPABASE_PUBLISHABLE_KEY agar aturan RLS tetap berlaku.
 * Digunakan untuk login, keluar, ganti password, dan kelola produk.
 */
export async function buatKoneksiAdmin() {
  const url = getSupabaseUrl();
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diatur di environment variable."
    );
  }

  const cookieStore = await cookies();

  return createSSRServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Diabaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

export const createServerClient = buatKoneksiServer;
export const createAdminClient = buatKoneksiAdmin;
