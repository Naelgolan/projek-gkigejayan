const sequelize = require('./config/database');
const Schedule = require('./models/Schedule');
const Ministry = require('./models/Ministry');
const Event = require('./models/Event');
const Staff = require('./models/Staff');
const OfficeInfo = require('./models/OfficeInfo');

async function seedData() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        // 1. Seed Schedules
        const existingSchedules = await Schedule.findAll();
        if (existingSchedules.length === 0) {
            await Schedule.bulkCreate([
                { type: 'Kebaktian Umum 1', day: 'Minggu', time: '06:30', location: 'Onsite & Online Streaming' },
                { type: 'Kebaktian Umum 2', day: 'Minggu', time: '09:00', location: 'Onsite - Ibadah Pagi' },
                { type: 'Kebaktian Umum 3', day: 'Minggu', time: '17:00', location: 'Onsite - Ibadah Sore' }
            ]);
            console.log('Schedules seeded successfully.');
        } else {
            console.log('Schedules already exist, skipped seeding.');
        }

        // 2. Seed Ministries
        const existingMinistries = await Ministry.findAll();
        if (existingMinistries.length === 0) {
            await Ministry.bulkCreate([
                { title: 'Komisi Anak', description: 'Wadah pelayanan untuk pembinaan iman anak-anak usia balita hingga sekolah dasar.' },
                { title: 'Komisi Remaja & Pemuda', description: 'Pembinaan kaum muda dalam persekutuan, pertumbuhan iman, dan kesaksian.' },
                { title: 'Komisi Musik & Pujian', description: 'Melayani dalam bidang pujian, paduan suara, pemusik, dan tata ibadah.' },
                { title: 'Komisi Dewasa', description: 'Pembinaan iman bagi jemaat dewasa dan keluarga.' }
            ]);
            console.log('Ministries seeded successfully.');
        } else {
            console.log('Ministries already exist, skipped seeding.');
        }

        // 3. Seed Events
        await Event.destroy({ where: {} });
        {
            await Event.bulkCreate([
                {
                    title: 'Paskah Jemaat GKI Gejayan 2026',
                    date: 'Minggu, 5 April 2026 - 06.00 WIB',
                    description: 'Kebaktian Kebangunan Rohani Paskah dan Perjamuan Kudus Bersama.',
                    content: 'Perayaan Paskah 2026 mengusung tema "Kemenangan Dalam Kebangkitan Kristus". Acara akan diawali Ibadah Subuh Paskah di Halaman Gereja pukul 05.00 WIB dan dilanjutkan Kebaktian Utama Paskah pukul 06.30 WIB di Gedung Utama. Tersedia juga Sekolah Minggu Paskah dan Perjamuan Kudus bagi seluruh warga jemaat.',
                    imageUrl: '/dalam.png',
                    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    documentTitle: 'Warta & Panduan Tata Ibadah Paskah 2026.pdf',
                    googlePhotosUrl: 'https://photos.google.com',
                    location: 'Gedung Utama GKI Gejayan',
                    isPast: false,
                    order: 1
                },
                {
                    title: 'Retret Pemuda & Remaja 2026',
                    date: 'Sabtu - Minggu, 16-17 Mei 2026',
                    description: 'Pembinaan iman dan persekutuan pemuda di Kaliurang.',
                    content: 'Retret pemuda dan remaja tahun 2026 bertajuk "Anchored in Grace". Peserta akan mendapatkan sesi materi pemulihan iman, kelompok diskusi, outbound malam keakraban, dan ibadah padang di area lereng Gunung Merapi Kaliurang.',
                    imageUrl: '/luar.jpg',
                    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    documentTitle: 'Form Pendaftaran & Rundown Retret Pemuda.pdf',
                    googlePhotosUrl: 'https://photos.google.com',
                    location: 'Wisma Retret Kaliurang, Sleman',
                    isPast: false,
                    order: 2
                },
                {
                    title: 'Perayaan Natal & Tahun Baru Jemaat 2025',
                    date: 'Kamis, 25 Desember 2025',
                    description: 'Dokumentasi perayaan Natal jemaat dan aksi kasih Natal.',
                    content: 'Perayaan Natal 2025 telah berlangsung dengan penuh sukacita dan kehikmatan. Dihadiri oleh lebih dari 1.200 jemaat. Selain ibadah sakral, komisi-komisi gereja telah membagikan 300 paket sembako bagi masyarakat sekitar Gejayan dan Soropadan dalam Aksi Kasih Natal.',
                    imageUrl: '/dalam.png',
                    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    documentTitle: 'Laporan Dokumentasi & Keuangan Natal 2025.pdf',
                    googlePhotosUrl: 'https://photos.google.com',
                    location: 'Gedung Utama GKI Gejayan',
                    isPast: true,
                    order: 3
                },
                {
                    title: 'Bakti Sosial & Pengobatan Gratis 2025',
                    date: 'Sabtu, 15 November 2025',
                    description: 'Pelayanan medis dan pembagian sembako warga Sleman.',
                    content: 'Dokumentasi kegiatan bakti sosial dan pemeriksaan kesehatan gratis yang diselenggarakan oleh Komisi Kesaksian dan Pelayanan (Kespel) GKI Gejayan bekerja sama dengan tim medis jemaat. Lebih dari 250 warga sekitar mendapatkan pemeriksaan fisik, gula darah, dan obat gratis.',
                    imageUrl: '/luar.jpg',
                    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    documentTitle: 'Ringkasan Laporan Baksos Kespel 2025.pdf',
                    googlePhotosUrl: 'https://photos.google.com',
                    location: 'Aula GKI Gejayan',
                    isPast: true,
                    order: 4
                }
            ]);
            console.log('Events seeded successfully.');
        }

        // 4. Seed Office Info
        const existingOfficeInfo = await OfficeInfo.findOne();
        if (!existingOfficeInfo) {
            await OfficeInfo.create({
                officeName: 'Sekretariat GKI Gejayan',
                address: 'Jl. Affandi Gg. Jemb. Merah No.84D, Soropadan, Condongcatur, Kec. Depok, Kabupaten Sleman, DIY 55283',
                phone: '(0274) 512345 / WhatsApp: 0812-3456-7890',
                email: 'gkigejayan@gmail.com',
                operatingHours: 'Senin - Sabtu: 08.00 - 16.00 WIB',
                notes: 'Melayani pelayanan surat keterangan jemaat, pendaftaran baptis/sidi, pernikahan, serta informasi umum kantor gereja.'
            });
            console.log('Office Info seeded successfully.');
        }

        // 5. Seed Staff Members
        const existingStaff = await Staff.findAll();
        if (existingStaff.length === 0) {
            await Staff.bulkCreate([
                {
                    name: 'Bpk. Sugeng Santoso',
                    role: 'Kepala Kantor Sekretariat',
                    phone: '0812-2345-6789',
                    email: 'sekretariat@gkigejayan.or.id',
                    image: '/logo polos.PNG',
                    bio: 'Melayani dan mengoordinasikan seluruh operasional administrasi serta kesekretariatan gereja.',
                    order: 1
                },
                {
                    name: 'Ibu Maria Christine',
                    role: 'Staf Keuangan & Bendahara Kantor',
                    phone: '0813-9876-5432',
                    email: 'keuangan@gkigejayan.or.id',
                    image: '/logo polos.PNG',
                    bio: 'Pengelolaan keuangan kantor, warta jemaat, dan persembahan.',
                    order: 2
                },
                {
                    name: 'Bpk. Yohanes Kurniawan',
                    role: 'Staf Tata Usaha & Multimedia',
                    phone: '0815-6789-0123',
                    email: 'tu.multimedia@gkigejayan.or.id',
                    image: '/logo polos.PNG',
                    bio: 'Pengelolaan administrasi data jemaat, persuratan, serta penyiapan sarana multimedia ibadah.',
                    order: 3
                }
            ]);
            console.log('Staff members seeded successfully.');
        }

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        process.exit();
    }
}

seedData();
