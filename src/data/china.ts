export const chinaProgram = {
  title: 'Beijing & Hangzhou Education Mission',
  date: '11–17 September 2026',
  quota: 20,
  facts: [
    ['7', 'hari perjalanan'],
    ['2', 'kota pendidikan'],
    ['2', 'expo internasional'],
    ['20', 'kursi delegasi'],
  ],
  differentiators: [
    ['Dua expo, satu perjalanan', 'CIFTIS di Beijing dan Worlddidac Asia di Hangzhou dipadukan dalam satu agenda tujuh hari.'],
    ['Akses ke ruang kelas', 'Dialog langsung dengan manajemen sekolah, didampingi penerjemah dan agenda kunjungan resmi.'],
    ['Datang sebagai delegasi', 'Setiap pertemuan dirancang untuk membuka percakapan profesional dan peluang kerja sama lanjutan.'],
  ],
  physicalBenefits: ['Hotel 4★ di dua kota', 'Kereta cepat Beijing–Hangzhou', 'Transportasi program', 'Konsumsi halal', 'Pengurusan visa', 'Asuransi perjalanan', 'Sertifikat dan dokumentasi'],
  professionalBenefits: ['Delegasi CIFTIS & Worlddidac', 'Kunjungan 3–6 sekolah', 'Business matching', 'Networking internasional', 'Referensi EdTech Asia', 'Wawasan kebijakan pendidikan', 'Jaringan pascaprogram'],
  cities: [
    { code: 'BJS', name: 'Beijing', cn: '北京', date: '11–14 September', note: 'Kebijakan & skala', items: ['CIFTIS 2026', 'Kunjungan 2–4 sekolah', 'Forum kebijakan & business matching'] },
    { code: 'HGH', name: 'Hangzhou', cn: '杭州', date: '14–17 September', note: 'Teknologi & praktik', items: ['Worlddidac Asia 2026', 'Kunjungan 1–2 sekolah', 'Ekosistem teknologi pendidikan'] },
  ],
  expos: [
    { chapter: '01', city: 'Beijing', name: 'CIFTIS 2026', longName: 'China International Fair for Trade in Services', date: '9–13 September 2026', venue: 'Shougang Exhibition Center', body: 'Rombongan hadir pada 12–13 September untuk menjelajahi smart education, forum kebijakan, dan business matching.', stats: [['2.400+', 'exhibitor lintas sektor'], ['110.000 m²', 'area pameran'], ['2 hari', 'agenda delegasi']] },
    { chapter: '02', city: 'Hangzhou', name: 'Worlddidac Asia 2026', longName: 'Pameran teknologi pendidikan berskala Asia', date: '15–17 September 2026', venue: 'Hangzhou Grand Convention Center', body: 'Dua hari untuk melihat EdTech, smart campus, AI dalam pendidikan, vokasi, dan peluang kerja sama antar-lembaga.', stats: [['500+', 'exhibitor'], ['50.000 m²', 'area pameran'], ['2 hari', 'eksplorasi penuh']] },
  ],
  itinerary: [
    ['01', 'Jum, 11 Sep', 'Jakarta → Beijing', 'Penerbangan, check-in, dan briefing pembuka.'],
    ['02', 'Sab, 12 Sep', 'Sekolah + CIFTIS', 'Kunjungan sekolah Beijing, dilanjutkan eksplorasi expo.'],
    ['03', 'Min, 13 Sep', 'CIFTIS sehari penuh', 'Exhibition, forum kebijakan, dan business matching.'],
    ['04', 'Sen, 14 Sep', 'Beijing → Hangzhou', 'Kunjungan sekolah lalu perjalanan kereta cepat ±4,5 jam.'],
    ['05', 'Sel, 15 Sep', 'Worlddidac Asia', 'Keynote, exhibition floor, dan sesi tematik EdTech.'],
    ['06', 'Rab, 16 Sep', 'Kolaborasi internasional', 'Worlddidac hari kedua dan farewell dinner.'],
    ['07', 'Kam, 17 Sep', 'Hangzhou → Jakarta', 'Penerbangan kembali ke Indonesia.'],
  ],
  packages: [
    ['Paket lengkap', 'Termasuk tiket pesawat pulang-pergi Jakarta–Tiongkok serta seluruh fasilitas program.'],
    ['Paket tanpa tiket', 'Seluruh fasilitas program; penerbangan internasional diatur mandiri oleh peserta.'],
  ],
  audience: ['Kepala dan wakil kepala sekolah', 'Pemilik atau pengurus yayasan', 'Pengawas dan pengambil kebijakan', 'Dosen, peneliti, dan konsultan', 'Praktisi EdTech'],
  faqs: [
    ['Berapa investasi programnya?', 'Rincian biaya dikirim melalui WhatsApp setelah Anda mengisi form minat. Tersedia paket lengkap dan paket tanpa tiket.'],
    ['Apakah visa diurus JAGATRIP?', 'Ya. Pengurusan visa Tiongkok termasuk dalam kedua paket. Peserta cukup menyiapkan dokumen yang diminta.'],
    ['Sekolah mana yang dikunjungi?', 'Nama sekolah masih dikoordinasikan bersama partner. Targetnya 2–4 sekolah di Beijing dan 1–2 sekolah di Hangzhou.'],
    ['Bagaimana ketersediaan makanan halal?', 'Konsumsi rombongan diatur di restoran halal dan kebutuhan peserta Muslim menjadi bagian perencanaan program.'],
    ['Perlukah berbahasa Mandarin?', 'Tidak. Kunjungan sekolah didampingi penerjemah; banyak exhibitor internasional juga menggunakan bahasa Inggris.'],
    ['Bagaimana jika kuota penuh?', 'Pendaftar berikutnya masuk daftar tunggu. Form minat tidak mengikat kewajiban pembayaran.'],
  ],
} as const;

export const chinaEventSchema = {
  '@context': 'https://schema.org', '@type': 'Event', name: `JAGATRIP #2 — ${chinaProgram.title}`,
  startDate: '2026-09-11', endDate: '2026-09-17', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled',
  location: chinaProgram.cities.map(({ name }) => ({ '@type': 'Place', name: `${name}, China` })),
  organizer: { '@type': 'Organization', name: 'PT Jagatrip Mitra Edukasi', url: 'https://jagatrip.com' },
};
