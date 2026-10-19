"use server";

import { redirect } from "next/navigation";
import { buatKoneksiAdmin } from "@/lib/supabase";

export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email");
  const password = data?.get?.("password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await buatKoneksiAdmin();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email).trim(),
    password: String(password),
  });

  if (error) {
    if (
      error.message?.toLowerCase().includes("invalid login credentials") ||
      error.status === 400
    ) {
      return { error: "Email atau password salah." };
    }
    return { error: error.message || "Gagal masuk. Periksa kembali email dan password Anda." };
  }

  redirect("/admin");
}

export async function keluar() {
  const supabase = await buatKoneksiAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

