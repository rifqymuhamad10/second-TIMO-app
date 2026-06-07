/**
 * resend.ts
 * 
 * Singleton instance Resend untuk pengiriman email.
 * Hanya dipakai di server-side (API routes).
 */
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('[resend] RESEND_API_KEY belum diset. Email tidak akan terkirim.');
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

// Alamat pengirim email
// Pakai domain Resend untuk dev (tanpa domain sendiri)
// Ganti ke "TIMO <noreply@domain-kamu.com>" setelah punya domain
export const EMAIL_FROM = 'TIMO <onboarding@resend.dev>';

// Base URL untuk link di email
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
