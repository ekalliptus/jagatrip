/**
 * Form Guard — cegah submit berulang (anti-spam sederhana).
 *
 * Setelah form berhasil di-submit, form dikunci (disable inputs + button)
 * dan flag disimpan di localStorage. Saat user kembali ke halaman,
 * form tetap terkunci.
 *
 * Client-side guard — bukan 100% bulletproof (localStorage bisa di-clear),
 * tapi efektif untuk pengguna normal.
 */

const STORAGE_KEY = 'jagatrip_form_submitted';

/** Cek apakah form (berdasarkan formId + sheet) sudah pernah di-submit */
export function isFormSubmitted(formId: string): boolean {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return false;
    const submitted: string[] = JSON.parse(data);
    return submitted.includes(formId);
  } catch {
    return false;
  }
}

/** Tandai form sudah di-submit & kunci form-nya */
export function lockForm(form: HTMLFormElement, formId: string, message?: string): void {
  // Simpan flag
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const submitted: string[] = data ? JSON.parse(data) : [];
    if (!submitted.includes(formId)) {
      submitted.push(formId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submitted));
    }
  } catch {
    // localStorage mungkin unavailable (incognito) — abaikan
  }

  // Kunci semua input + button
  form.querySelectorAll('input, select, textarea, button').forEach((el) => {
    (el as HTMLInputElement).disabled = true;
  });

  // Tampilkan pesan jika ada status element
  if (message) {
    const status = form.querySelector('[class*="status"], [id*="status"]');
    if (status) {
      status.textContent = message;
      status.className = status.className.replace(/ok|err/g, '').trim() + ' ok';
      (status as HTMLElement).hidden = false;
    }
  }
}

/**
 * Inisialisasi guard untuk sebuah form.
 * Panggil di DOMContentLoaded — jika form sudah pernah di-submit, kunci otomatis.
 */
export function initFormGuard(form: HTMLFormElement | null, formId: string, message?: string): void {
  if (!form) return;
  if (isFormSubmitted(formId)) {
    lockForm(form, formId, message ?? '✓ Anda sudah mengirim data. Form ini tidak bisa diisi lagi.');
  }
}
