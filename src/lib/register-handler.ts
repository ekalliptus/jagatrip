import { SITE } from '../data/site';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwrwCUYnuIUCflczefMlYAHdCnOD-5PMqVEL94QTPWy6Hkds6SiOQLfyo7PZpVoqtjiZg/exec';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function initRegisterForm(): void {
  const form = document.getElementById('register-form') as HTMLFormElement | null;
  if (!form) return;

  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const statusEl = document.getElementById('register-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const payload: Record<string, string> = {};
    data.forEach((val, key) => {
      if (typeof val === 'string') payload[key] = val.trim();
    });

    // Validasi required
    const required = [
      'nama_lengkap', 'nama_panggilan', 'alamat', 'wa', 'email',
      'no_paspor', 'expired_paspor',
      'kota_asal', 'bandara', 'punya_tiket',
      'ukuran_kaos', 'teman_sekamar', 'alergi',
      'status_bayar', 'instansi', 'jabatan', 'motivasi',
    ];
    for (const field of required) {
      if (!payload[field]) {
        showStatus('error', `Mohon lengkapi field "${field.replace(/_/g, ' ')}".`);
        return;
      }
    }

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Mengupload data & dokumen...'; }
    showStatus('info', 'Sedang mengirim data dan mengupload dokumen. Mohon tunggu...');

    try {
      // Proses file uploads → base64
      const fileFields = ['file_paspor', 'file_ktp', 'file_bukti_transfer'];
      for (const field of fileFields) {
        const input = form.querySelector<HTMLInputElement>(`input[name="${field}"]`);
        const file = input?.files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            showStatus('error', `File ${field.replace(/_/g, ' ')} terlalu besar (maks 5MB).`);
            if (btn) { btn.disabled = false; btn.textContent = 'Kirim Registrasi & Lanjut ke WhatsApp →'; }
            return;
          }
          payload[field] = await fileToBase64(file);
          payload[field + '_name'] = file.name;
          payload[field + '_type'] = file.type;
        }
      }

      showStatus('info', 'Mengupload ke server... Jangan tutup halaman ini.');

      // POST ke Apps Script — AWAIT sampai selesai (file besar butuh waktu)
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          _sheet: 'Registrasi',
          ...payload,
          timestamp: new Date().toISOString(),
          source: window.location.href,
        }),
      });

      // Meta Pixel
      if (window.fbq) window.fbq('track', 'CompleteRegistration');

      showStatus('success', '✅ Data berhasil dikirim! Mengalihkan ke WhatsApp...');

      // Build WA message & redirect
      const msg = [
        'Halo admin JAGATRIP 👋',
        '',
        'Saya sudah mengisi *Form Registrasi Ulang* di website.',
        '',
        '📋 Data saya:',
        `Nama: ${payload.nama_lengkap}`,
        `Panggilan: ${payload.nama_panggilan}`,
        `Instansi: ${payload.instansi}`,
        `Jabatan: ${payload.jabatan}`,
        `Kota Asal: ${payload.kota_asal}`,
        `Bandara: ${payload.bandara}`,
        `Status Bayar: ${payload.status_bayar}`,
        '',
        'Mohon konfirmasi registrasi saya. Terima kasih! 🙏',
      ].join('\n');

      setTimeout(() => {
        window.location.href = `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(msg)}`;
      }, 1000);

    } catch {
      showStatus('error', 'Gagal mengirim. Coba lagi atau hubungi admin via WhatsApp.');
      if (btn) { btn.disabled = false; btn.textContent = 'Kirim Registrasi & Lanjut ke WhatsApp →'; }
    }
  });

  function showStatus(type: 'success' | 'error' | 'info', msg: string): void {
    if (!statusEl) return;
    statusEl.textContent = msg;
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      info: 'text-blue-600',
    };
    statusEl.className = `text-sm text-center mt-3 font-medium ${colors[type]}`;
    statusEl.classList.remove('hidden');
  }
}
