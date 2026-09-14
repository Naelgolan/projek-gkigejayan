import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Menu, X, ChevronRight, MapPin, Mail, Phone, Instagram, Clock, Star, ChevronLeft, ChevronDown, Youtube, FileText, Download, ExternalLink, Calendar, Image as ImageIcon, Building, PhoneCall, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ManageSchedules from './pages/Admin/ManageSchedules';
import ManagePastors from './pages/Admin/ManagePastors';
import ManageMinistries from './pages/Admin/ManageMinistries';
import ManageEvents from './pages/Admin/ManageEvents';
import ManageContacts from './pages/Admin/ManageContacts';
import ManageVolunteers from './pages/Admin/ManageVolunteers';
import ManageHeroPhotos from './pages/Admin/ManageHeroPhotos';
import ManageStaff from './pages/Admin/ManageStaff';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [ministries, setMinistries] = useState([]);
    const [pastors, setPastors] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [officeInfo, setOfficeInfo] = useState({
        officeName: 'Sekretariat GKI Gejayan',
        phone: '(0274) 512345 / WhatsApp: 0812-3456-7890',
        email: 'gkigejayan@gmail.com',
        operatingHours: 'Senin - Sabtu: 08.00 - 16.00 WIB',
        address: 'Jl. Affandi Gg. Jemb. Merah No.84D, Soropadan, Condongcatur, Sleman, DIY 55283',
        notes: 'Melayani pelayanan surat keterangan jemaat, pendaftaran baptis/sidi, pernikahan, serta informasi umum kantor gereja.'
    });
    const [events, setEvents] = useState([
        { id: 'slide1', title: "GKI Gejayan", date: "Bersama Bertumbuh Dalam Kasih Kristus", description: "SELAMAT DATANG", imageUrl: "/luar.jpg" },
        { id: 'slide2', title: "Event Mendatang", date: "Segera Hadir di GKI Gejayan", description: "UPCOMING EVENT", imageUrl: "/dalam.png" }
    ]);
    const [allEventsData, setAllEventsData] = useState([]);
    const [activeEventTab, setActiveEventTab] = useState('mendatang'); // 'mendatang' | 'lewat'
    const [selectedEventModal, setSelectedEventModal] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [direction, setDirection] = useState(0);
    const [activeAboutTab, setActiveAboutTab] = useState('sejarah');
    const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
    const [activeNavSection, setActiveNavSection] = useState('home');

    // Form inputs and states
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [contactSuccess, setContactSuccess] = useState('');
    const [vModalOpen, setVModalOpen] = useState(false);
    const [selectedMinistry, setSelectedMinistry] = useState(null);
    const [volunteerForm, setVolunteerForm] = useState({ fullName: '', email: '' });
    const [volunteerSuccess, setVolunteerSuccess] = useState('');

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/contacts', contactForm);
            setContactSuccess(res.data.message);
            setContactForm({ name: '', email: '', message: '' });
            setTimeout(() => setContactSuccess(''), 5000);
        } catch (err) {
            alert('Gagal mengirim pesan');
        }
    };

    const openVolunteerModal = (ministry) => {
        setSelectedMinistry(ministry);
        setVolunteerForm({ fullName: '', email: '' });
        setVModalOpen(true);
    };

    const handleVolunteerSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/ministries/register', {
                fullName: volunteerForm.fullName,
                email: volunteerForm.email,
                ministryId: selectedMinistry.id
            });
            setVolunteerSuccess(res.data.message);
            setVolunteerForm({ fullName: '', email: '' });
            setTimeout(() => {
                setVolunteerSuccess('');
                setVModalOpen(false);
            }, 3000);
        } catch (err) {
            alert('Gagal mendaftar');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [schRes, minRes, evRes, pasRes, offRes, stfRes] = await Promise.all([
                    axios.get('/api/schedules'),
                    axios.get('/api/ministries'),
                    axios.get('/api/events'),
                    axios.get('/api/pastors'),
                    axios.get('/api/office-info'),
                    axios.get('/api/staff')
                ]);
                if (schRes.data.length > 0) setSchedules(schRes.data);
                if (minRes.data.length > 0) setMinistries(minRes.data);
                if (pasRes.data.length > 0) setPastors(pasRes.data);
                if (offRes.data) setOfficeInfo(offRes.data);
                if (stfRes.data.length > 0) setStaffList(stfRes.data);
                if (evRes.data.length > 0) {
                    setAllEventsData(evRes.data);
                    const heroSlides = evRes.data.filter(e => !e.isPast);
                    setEvents([
                        { id: 'default', title: "GKI Gejayan", date: "Bersama Bertumbuh Dalam Kasih Kristus", description: "SELAMAT DATANG", imageUrl: "/luar.jpg" },
                        ...(heroSlides.length > 0 ? heroSlides : evRes.data)
                    ]);
                }
            } catch (err) {
                console.error('Data fetch error:', err);
            }
        };
        fetchData();

        // Socket.IO realtime connection
        const socket = io('/', { transports: ['websocket', 'polling'] });
        socket.on('data_updated', (payload) => {
            console.log('Realtime update notification received:', payload);
            fetchData();
        });

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = ['home', 'about', 'events', 'ministries', 'office', 'schedule', 'contact'];
            const scrollPosition = window.scrollY + 250;

            for (let i = sections.length - 1; i >= 0; i--) {
                const secId = sections[i];
                const el = document.getElementById(secId);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPosition >= top) {
                        setActiveNavSection(secId);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            socket.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIdx((prev) => (prev + 1) % events.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [events.length]);

    const variants = {
        enter: (d) => ({ x: d > 0 ? 1000 : -1000, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (d) => ({ zIndex: 0, x: d < 0 ? 1000 : -1000, opacity: 0 })
    };

    const homePageContent = (
        <div className="min-h-screen font-sans selection:bg-gki-tan">
            {/* Nav */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gki-wood py-3 shadow-lg' : 'bg-transparent py-5'}`}>
                <div className="container mx-auto px-6 flex items-center justify-between text-white">
                    <a
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveNavSection('home');
                            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-3 cursor-pointer no-underline text-white hover:opacity-90 transition-opacity"
                        title="Ke Beranda GKI Gejayan"
                    >
                        <img src="/logo polos.PNG" alt="Logo" className="h-10 invert" />
                        <span className="font-serif text-xl tracking-wider uppercase hidden sm:block">GKI Gejayan</span>
                    </a>

                    {/* Desktop Nav Items with Dynamic Sliding Pill Highlight */}
                    <div className="hidden md:flex items-center gap-2 font-sans text-base lg:text-lg">
                        {[
                            { id: 'home', label: 'Beranda', href: '#home' },
                            { id: 'about', label: 'Tentang Kami', isDropdown: true },
                            { id: 'events', label: 'Kegiatan', href: '#events' },
                            { id: 'ministries', label: 'Pelayanan', href: '#ministries' },
                            { id: 'office', label: 'Kantor & Staf', href: '#office' },
                            { id: 'schedule', label: 'Jadwal', href: '#schedule' },
                            { id: 'contact', label: 'Kontak', href: '#contact' },
                        ].map((item) => {
                            const isActive = activeNavSection === item.id;
                            if (item.isDropdown) {
                                return (
                                    <div
                                        key={item.id}
                                        className="relative py-1"
                                        onMouseEnter={() => setIsAboutDropdownOpen(true)}
                                        onMouseLeave={() => setIsAboutDropdownOpen(false)}
                                    >
                                        <button
                                            onClick={() => {
                                                setActiveNavSection('about');
                                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`relative px-5 py-2 rounded-full font-semibold transition-colors flex items-center gap-1 cursor-pointer border-0 bg-transparent text-white ${isActive ? 'font-bold' : 'hover:text-gki-cream'}`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNavPill"
                                                    className="absolute inset-0 bg-gki-tan rounded-full -z-10 shadow-md"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                            <span>{item.label}</span>
                                            <ChevronDown size={18} className={`transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {isAboutDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute left-0 mt-2 w-48 bg-gki-wood text-white rounded-xl shadow-xl border border-white/10 overflow-hidden z-50 py-2"
                                                >
                                                    {[
                                                        { id: 'sejarah', label: 'Sejarah' },
                                                        { id: 'visi-misi', label: 'Visi & Misi' },
                                                        { id: 'pendeta', label: 'Profil Pendeta' },
                                                    ].map((subItem) => (
                                                        <button
                                                            key={subItem.id}
                                                            onClick={() => {
                                                                setActiveAboutTab(subItem.id);
                                                                setActiveNavSection('about');
                                                                setIsAboutDropdownOpen(false);
                                                                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                                                            }}
                                                            className="w-full text-left px-5 py-3 text-sm hover:bg-white/10 hover:text-gki-cream transition-colors bg-transparent border-0 cursor-pointer text-white"
                                                        >
                                                            {subItem.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            }

                            return (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setActiveNavSection(item.id)}
                                    className={`relative px-5 py-2 rounded-full font-semibold transition-colors no-underline ${isActive ? 'text-white font-bold' : 'text-white/90 hover:text-white hover:bg-white/10'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavPill"
                                            className="absolute inset-0 bg-gki-tan rounded-full -z-10 shadow-md"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    {item.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-gki-tan focus:outline-none bg-transparent border-0 cursor-pointer"
                        aria-label="Toggle Navigation"
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* Mobile Drawer Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-gki-wood border-t border-white/10 px-6 py-4 flex flex-col gap-2 shadow-2xl"
                        >
                            {[
                                { id: 'home', label: 'Beranda', href: '#home' },
                                { id: 'about', label: 'Tentang Kami', isDropdown: true },
                                { id: 'events', label: 'Kegiatan', href: '#events' },
                                { id: 'ministries', label: 'Pelayanan', href: '#ministries' },
                                { id: 'office', label: 'Kantor & Staf', href: '#office' },
                                { id: 'schedule', label: 'Jadwal', href: '#schedule' },
                                { id: 'contact', label: 'Kontak', href: '#contact' },
                            ].map((item) => {
                                const isActive = activeNavSection === item.id;
                                if (item.isDropdown) {
                                    return (
                                        <div key={item.id} className="flex flex-col gap-1 py-1">
                                            <span className="text-gki-tan text-xs font-bold uppercase tracking-wider px-3">Tentang Kami</span>
                                            {[
                                                { id: 'sejarah', label: 'Sejarah' },
                                                { id: 'visi-misi', label: 'Visi & Misi' },
                                                { id: 'pendeta', label: 'Profil Pendeta' },
                                            ].map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={() => {
                                                        setActiveAboutTab(subItem.id);
                                                        setActiveNavSection('about');
                                                        setIsMenuOpen(false);
                                                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className="text-left py-2 px-5 rounded-xl text-white hover:bg-white/10 text-sm font-semibold bg-transparent border-0 cursor-pointer"
                                                >
                                                    • {subItem.label}
                                                </button>
                                            ))}
                                        </div>
                                    );
                                }
                                return (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => {
                                            setActiveNavSection(item.id);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`py-2.5 px-4 rounded-xl text-base font-semibold transition-colors no-underline ${isActive ? 'bg-gki-tan text-white font-bold' : 'text-white/90 hover:bg-white/10'}`}
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Slider */}
            <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-gki-wood">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIdx}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img src={events[currentIdx]?.imageUrl} className="w-full h-full object-cover brightness-50" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center text-white z-20">
                            <div className="text-center px-6">
                                <span className="text-gki-tan font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                                    {events[currentIdx]?.description}
                                </span>
                                <h1 className="text-3xl sm:text-6xl md:text-8xl font-serif mb-6 leading-tight">
                                    {events[currentIdx]?.title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light italic">
                                    {events[currentIdx]?.date}
                                </p>
                                <a href="#schedule" className="group inline-flex items-center gap-2 bg-white text-gki-wood px-8 py-4 rounded-full font-bold hover:bg-gki-tan hover:text-white transition-all shadow-xl">
                                    GABUNG IBADAH <ChevronRight size={18} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {events.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'bg-white w-8' : 'bg-white/30'}`} />
                    ))}
                </div>
            </section>

            {/* Other Sections - NO CHANGES to design */}
            {/* About & Pastors tabbed section */}
            <section id="about" className="py-24 bg-gki-cement text-gki-wood relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Tentang Kami</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-gki-wood">GKI Gejayan</h2>
                        <p className="text-gki-stone text-xl font-light leading-relaxed">
                            Mengenal lebih dekat komunitas kami, sejarah perjalanan iman, visi pelayanan, serta para gembala yang melayani jemaat.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center gap-2 md:gap-6 mb-16 border-b border-gki-tan/20 pb-4 max-w-xl mx-auto">
                        {[
                            { id: 'sejarah', label: 'Sejarah' },
                            { id: 'visi-misi', label: 'Visi & Misi' },
                            { id: 'pendeta', label: 'Profil Pendeta' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveAboutTab(tab.id)}
                                className={`relative py-2 px-3 sm:px-4 md:px-6 font-serif text-base sm:text-lg md:text-xl transition-all capitalize select-none outline-none bg-transparent border-0 cursor-pointer whitespace-nowrap ${activeAboutTab === tab.id ? 'text-gki-wood font-semibold' : 'text-gki-stone hover:text-gki-wood'
                                    }`}
                            >
                                {tab.label}
                                {activeAboutTab === tab.id && (
                                    <motion.div
                                        layoutId="activeAboutTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gki-tan"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Display */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeAboutTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[400px]"
                        >
                            {activeAboutTab === 'sejarah' && (
                                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-gki-tan/10 rounded-2xl blur-lg group-hover:bg-gki-tan/20 transition-all duration-300"></div>
                                        <img src="/dalam.png" alt="Interior" className="relative rounded-2xl shadow-xl w-full object-cover aspect-[4/3]" />
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-4xl md:text-5xl font-serif text-gki-wood leading-tight">Perjalanan Iman GKI Gejayan</h3>
                                        <div>
                                            {/* 1. Cikal Bakal & Perintisan */}
                                            <div className="mb-8">
                                                <h3 className="text-gki-tan text-xl md:text-2xl font-semibold mb-3">
                                                    1. Cikal Bakal & Perintisan (1990 - 1992)
                                                </h3>
                                                <p className="text-gki-stone text-lg md:text-xl leading-relaxed font-light mb-4">
                                                    GKI Gejayan berawal dari persekutuan wilayah GKI Ngupasan (wilayah 16, 17, dan 18) yang mengadakan pertemuan sebulan sekali di area Yogyakarta bagian utara-timur. Pada tahun 1990-an, mulai dirintis rencana pembangunan gedung gereja di daerah Gejayan, dan izin pendirian bangunan resmi terbit pada tanggal 26 April 1991. Perayaan Natal pertama kali diselenggarakan di gedung baru ini pada 16 Desember 1992.
                                                </p>
                                            </div>

                                            {/* 2. Status Pos PI & Bakal Jemaat */}
                                            <div className="mb-8">
                                                <h3 className="text-gki-tan text-xl md:text-2xl font-semibold mb-3">
                                                    2. Status Pos PI & Bakal Jemaat (1993 - 1999)
                                                </h3>
                                                <p className="text-gki-stone text-lg md:text-xl leading-relaxed font-light mb-4">
                                                    <strong>Pos PI Gejayan (1993):</strong> Melalui kebaktian perdana pada 3 Januari 1993, tempat ini resmi menjadi Pos PI (Pekabaran Injil) Gejayan dengan sekitar 90 anggota. Seiring pertumbuhan jemaat, jam ibadah bertambah dari satu kali menjadi tiga kali kebaktian pada Januari 1996.
                                                </p>
                                                <p className="text-gki-stone text-lg md:text-xl leading-relaxed font-light mb-4">
                                                    <strong>Bakal Jemaat / Bajem (1996):</strong> Statusnya meningkat menjadi Bakal Jemaat pada 3 November 1996 seiring berkembangnya berbagai persekutuan kategorial. Di bidang kesaksian dan pelayanan, Bajem Gejayan aktif dalam aksi sosial, seperti gerakan "nasi peduli Rp 1.000" saat krisis moneter 1998, pengobatan gratis, dan beasiswa.
                                                </p>
                                            </div>

                                            {/* 3. Pendewasaan */}
                                            <div className="mb-8">
                                                <h3 className="text-gki-tan text-xl md:text-2xl font-semibold mb-3">
                                                    3. Pendewasaan GKI Gejayan (2000)
                                                </h3>
                                                <p className="text-gki-stone text-lg md:text-xl leading-relaxed font-light mb-4">
                                                    Setelah bertransformasi menjadi Bakal Jemaat (Bajem) pada 3 November 1996, melalui anugerah Tuhan, GKI Gejayan resmi didewasakan sebagai jemaat mandiri pada <strong className="font-semibold text-gki-tan">3 Maret 2000</strong> dengan mengusung tema <em>”Berakar ke Bawah dan Bertumbuh ke Atas”</em>.
                                                </p>
                                            </div>

                                            {/* 4. Perkembangan Pelayanan & Pos Kebaktian */}
                                            <div className="mb-8">
                                                <h3 className="text-gki-tan text-xl md:text-2xl font-semibold mb-3">
                                                    4. Perkembangan Pelayanan & Pos Kebaktian
                                                </h3>
                                                <p className="text-gki-stone text-lg md:text-xl leading-relaxed font-light mb-4">
                                                    Seiring kedewasaannya, pelayanan GKI Gejayan terus berkembang melalui peneguhan pendeta jemaat tetap dan perluasan pos pelayanan. GKI Gejayan membidani lahirnya GKI Adisucipto yang didewasakan pada 1 Agustus 2018.
                                                </p>
                                                <p className="text-gki-stone text-lg md:text-xl leading-relaxed font-light mb-4">
                                                    Untuk mengurai kepadatan jemaat di gedung utama, pada 19 Agustus 2018 dibuka <strong className="font-semibold text-gki-tan">Pos Kebaktian The Grace</strong> di Hartono Mall (yang kini bertransformasi menjadi Pakuwon Mall Jogja) untuk terus melebarkan jangkauan kesaksian dan pelayanan jemaat.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeAboutTab === 'visi-misi' && (
                                <div className="max-w-4xl mx-auto space-y-12">
                                    <div className="bg-gki-cream/10 border-l-4 border-gki-tan p-8 rounded-r-2xl shadow-sm">
                                        <span className="text-gki-tan font-bold tracking-[0.1em] uppercase text-xs mb-2 block">Visi Kami</span>
                                        <h3 className="text-3xl md:text-4xl font-serif leading-relaxed text-gki-wood italic">
                                            "Menjadi komunitas anak-anak Bapa yang bertumbuh dinamis dan berdampak bagi masyarakat multikultural di Indonesia."
                                        </h3>
                                    </div>
                                    <div className="bg-gki-cream/10 border-l-4 border-gki-tan p-8 rounded-r-2xl shadow-sm">
                                        <span className="text-gki-tan font-bold tracking-[0.1em] uppercase text-xs mb-2 block">Misi</span>
                                        <h3 className="text-3xl md:text-4xl font-serif leading-relaxed text-gki-wood italic">
                                            "Membina warga jemaat GKI GEJAYAN agar siap menerima pengutusan Tuhan kemanapun."
                                        </h3>
                                    </div>
                                </div>
                            )}

                            {activeAboutTab === 'pendeta' && (
                                <div className="space-y-12">
                                    <div className="text-center max-w-xl mx-auto">
                                        <h3 className="text-4xl md:text-5xl font-serif text-gki-wood mb-4">Gembala Sidang Jemaat</h3>
                                        <p className="text-gki-stone text-base leading-relaxed font-light">
                                            Para pelayan firman dan sakramen yang mendampingi jemaat dalam perjalanan iman dan pelayanan kasih di GKI Gejayan.
                                        </p>
                                    </div>
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
                                        {pastors.length > 0 ? (
                                            pastors.map((p) => (
                                                <div key={p.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gki-cement/20 relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-gki-wood opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                                                    <img src={p.image || '/logo polos.PNG'} alt={p.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-6 bg-gki-cement shadow-md group-hover:scale-105 transition-transform duration-300" />
                                                    <h3 className="text-3xl font-serif text-gki-wood mb-2">{p.name}</h3>
                                                    <p className="text-gki-tan text-base font-bold tracking-wider uppercase mb-4">{p.role}</p>
                                                    <p className="text-gki-stone text-base leading-relaxed">{p.bio}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-8 text-center text-gki-stone">
                                                Belum ada profil pendeta yang tersedia.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Events & Dokumentasi Section */}
            <section id="events" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Kegiatan & Dokumentasi</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 text-gki-wood leading-tight">Seputar Kegiatan Jemaat</h2>
                        <p className="text-gki-stone text-lg md:text-xl font-light leading-relaxed">
                            Informasi kegiatan mendatang, warta ibadah, serta arsip dokumentasi kegiatan yang telah terlaksana di GKI Gejayan.
                        </p>

                        {/* Tab Switcher */}
                        <div className="flex justify-center gap-4 mt-10">
                            <button
                                onClick={() => setActiveEventTab('mendatang')}
                                className={`px-6 py-3 rounded-full font-serif text-base md:text-lg transition-all flex items-center gap-2 cursor-pointer ${activeEventTab === 'mendatang'
                                    ? 'bg-gki-wood text-white shadow-lg font-semibold'
                                    : 'bg-gki-cream/30 text-gki-stone hover:bg-gki-cream hover:text-gki-wood'
                                    }`}
                            >
                                <Calendar size={18} />
                                Kegiatan Mendatang
                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${activeEventTab === 'mendatang' ? 'bg-gki-tan text-white' : 'bg-gki-stone/20 text-gki-wood'}`}>
                                    {allEventsData.filter(e => !e.isPast).length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveEventTab('lewat')}
                                className={`px-6 py-3 rounded-full font-serif text-base md:text-lg transition-all flex items-center gap-2 cursor-pointer ${activeEventTab === 'lewat'
                                    ? 'bg-gki-wood text-white shadow-lg font-semibold'
                                    : 'bg-gki-cream/30 text-gki-stone hover:bg-gki-cream hover:text-gki-wood'
                                    }`}
                            >
                                <Clock size={18} />
                                Kegiatan yang Sudah Lewat
                                <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${activeEventTab === 'lewat' ? 'bg-gki-tan text-white' : 'bg-gki-stone/20 text-gki-wood'}`}>
                                    {allEventsData.filter(e => e.isPast).length}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Events Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allEventsData
                            .filter(ev => activeEventTab === 'mendatang' ? !ev.isPast : ev.isPast)
                            .map((ev) => (
                                <motion.div
                                    key={ev.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-gki-cream/20 rounded-3xl overflow-hidden border border-gki-tan/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="relative h-56 overflow-hidden bg-gki-cement">
                                            <img
                                                src={ev.imageUrl || '/luar.jpg'}
                                                alt={ev.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md ${ev.isPast ? 'bg-amber-700' : 'bg-emerald-700'
                                                    }`}>
                                                    {ev.isPast ? 'Dokumentasi' : 'Mendatang'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gki-tan uppercase tracking-wider mb-3">
                                                <span className="flex items-center gap-1.5"><Clock size={15} /> {ev.date}</span>
                                                {ev.location && <span className="flex items-center gap-1.5"><MapPin size={15} /> {ev.location}</span>}
                                            </div>

                                            <h3 className="text-2xl font-serif text-gki-wood mb-3 leading-snug group-hover:text-gki-tan transition-colors">
                                                {ev.title}
                                            </h3>

                                            <p className="text-gki-stone text-sm leading-relaxed mb-6 line-clamp-3">
                                                {ev.description}
                                            </p>

                                            {ev.documentUrl && (
                                                <div className="mb-3 flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-gki-tan/20 text-xs text-gki-wood">
                                                    <FileText size={18} className="text-gki-tan shrink-0" />
                                                    <span className="font-medium truncate">{ev.documentTitle || 'Dokumen Lampiran.pdf'}</span>
                                                </div>
                                            )}

                                            {ev.googlePhotosUrl && (
                                                <a
                                                    href={ev.googlePhotosUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mb-6 flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-xs text-blue-900 font-semibold transition-colors no-underline group/link"
                                                >
                                                    <div className="flex items-center gap-2.5 truncate">
                                                        <ImageIcon size={18} className="text-blue-600 shrink-0" />
                                                        <span className="truncate">Album Google Photos</span>
                                                    </div>
                                                    <ExternalLink size={14} className="text-blue-600 shrink-0 group-hover/link:translate-x-0.5 transition-transform" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-8 pb-8 pt-0">
                                        <button
                                            onClick={() => setSelectedEventModal(ev)}
                                            className="w-full py-3.5 px-6 rounded-full bg-gki-wood text-white hover:bg-gki-tan font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <FileText size={16} /> Lihat Dokumen & Detail
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                    </div>

                    {allEventsData.filter(ev => activeEventTab === 'mendatang' ? !ev.isPast : ev.isPast).length === 0 && (
                        <div className="text-center py-16 bg-gki-cream/10 rounded-3xl border border-dashed border-gki-tan/30">
                            <p className="text-gki-stone text-lg">Belum ada kegiatan yang ditampilkan pada kategori ini.</p>
                        </div>
                    )}
                </div>
            </section>

            <section id="ministries" className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Pelayanan</span>
                    <h2 className="text-5xl md:text-6xl font-serif text-gki-wood mb-16">Temukan Tempat Anda Melayani</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {ministries.map((min) => (
                            <div key={min.id} className="p-8 rounded-2xl bg-gki-cream/30 border border-gki-tan/10 group text-left flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 bg-gki-wood rounded-xl flex items-center justify-center mb-6 text-white"><Clock size={24} /></div>
                                    <h3 className="text-2xl font-serif text-gki-wood mb-3">{min.title}</h3>
                                    <p className="text-gki-stone text-base leading-relaxed mb-6">{min.description}</p>
                                </div>
                                <button
                                    onClick={() => openVolunteerModal(min)}
                                    className="w-full py-3 bg-gki-wood text-white rounded-full font-bold hover:bg-gki-tan transition-all text-sm tracking-wider uppercase mt-4"
                                >
                                    Daftar Relawan
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Standalone Office & Staff Pekerja Section */}
            <section id="office" className="py-24 bg-gki-cement text-gki-wood relative overflow-hidden border-t border-gki-tan/10">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Kantor & Staf</span>
                        <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight text-gki-wood">Kantor & Staf Pekerja</h2>
                        <p className="text-gki-stone text-xl font-light leading-relaxed">
                            Pusat pelayanan administrasi kesekretariatan serta para staf pekerja yang siap melayani jemaat GKI Gejayan.
                        </p>
                    </div>

                    <div className="space-y-16 max-w-6xl mx-auto">
                        {/* Header Info Sekretariat Kantor */}
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gki-tan/20">
                            <div className="text-center max-w-2xl mx-auto mb-10">
                                <span className="px-4 py-1.5 rounded-full bg-gki-tan/15 text-gki-tan font-bold text-xs uppercase tracking-widest inline-block mb-3">
                                    Sekretariat Kantor Gereja
                                </span>
                                <h3 className="text-3xl md:text-5xl font-serif text-gki-wood mb-3">
                                    {officeInfo.officeName || 'Sekretariat GKI Gejayan'}
                                </h3>
                                <p className="text-gki-stone text-base leading-relaxed font-light">
                                    {officeInfo.notes || 'Pusat pelayanan administrasi jemaat, kesekretariatan, permohonan baptis, pernikahan, serta informasi pelayanan kantor.'}
                                </p>
                            </div>

                            {/* Contact Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Phone Card */}
                                <div className="bg-gki-cream/20 p-6 rounded-2xl border border-gki-tan/20 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-gki-wood text-gki-tan flex items-center justify-center mb-4">
                                            <PhoneCall size={24} />
                                        </div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gki-tan mb-1">Nomor Telepon & WA</h4>
                                        <p className="text-gki-wood font-semibold text-base mb-4">{officeInfo.phone}</p>
                                    </div>
                                    <a
                                        href={`tel:${officeInfo.phone?.replace(/[^0-9+]/g, '')}`}
                                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gki-wood text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-gki-tan transition-all no-underline"
                                    >
                                        <Phone size={14} /> Hubungi Telepon
                                    </a>
                                </div>

                                {/* Email Card */}
                                <div className="bg-gki-cream/20 p-6 rounded-2xl border border-gki-tan/20 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-gki-wood text-gki-tan flex items-center justify-center mb-4">
                                            <Mail size={24} />
                                        </div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gki-tan mb-1">Gmail / Email Kantor</h4>
                                        <p className="text-gki-wood font-semibold text-base mb-4 truncate">{officeInfo.email}</p>
                                    </div>
                                    <a
                                        href={`mailto:${officeInfo.email}`}
                                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gki-wood text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-gki-tan transition-all no-underline"
                                    >
                                        <Send size={14} /> Kirim Email
                                    </a>
                                </div>

                                {/* Hours Card */}
                                <div className="bg-gki-cream/20 p-6 rounded-2xl border border-gki-tan/20 flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-gki-wood text-gki-tan flex items-center justify-center mb-4">
                                            <Clock size={24} />
                                        </div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gki-tan mb-1">Jam Operasional</h4>
                                        <p className="text-gki-wood font-semibold text-base leading-snug">{officeInfo.operatingHours}</p>
                                    </div>
                                    <div className="pt-4 text-xs text-gki-stone border-t border-gki-tan/10">
                                        Melayani di jam kerja operasional kantor
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Staff Workers Section */}
                        <div>
                            <div className="text-center max-w-xl mx-auto mb-12">
                                <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-xs mb-2 block">Tim Operasional</span>
                                <h3 className="text-4xl md:text-5xl font-serif text-gki-wood mb-4">Staf Pekerja Kantor</h3>
                                <p className="text-gki-stone text-base leading-relaxed font-light">
                                    Para staf pekerja yang siap melayani kebutuhan administrasi, kesekretariatan, dan persekutuan jemaat di GKI Gejayan.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                                {staffList.length > 0 ? (
                                    staffList.map((staf) => (
                                        <div key={staf.id} className="bg-white p-8 rounded-3xl shadow-lg border border-gki-cement/20 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                                            <div className="absolute inset-0 bg-gki-wood opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                                            <img
                                                src={staf.image || '/logo polos.PNG'}
                                                alt={staf.name}
                                                className="w-28 h-28 rounded-full object-cover mx-auto mb-6 bg-gki-cement shadow-md group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <h3 className="text-2xl font-serif text-gki-wood mb-1 text-center">{staf.name}</h3>
                                            <p className="text-gki-tan text-xs font-bold tracking-wider uppercase mb-4 text-center">{staf.role}</p>

                                            <div className="space-y-2 text-xs text-gki-stone pt-4 border-t border-gki-tan/10">
                                                {staf.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-gki-tan shrink-0" />
                                                        <span>{staf.phone}</span>
                                                    </div>
                                                )}
                                                {staf.email && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-gki-tan shrink-0" />
                                                        <span className="truncate">{staf.email}</span>
                                                    </div>
                                                )}
                                                {staf.bio && (
                                                    <p className="text-gki-stone text-xs leading-relaxed mt-2 font-light italic">{staf.bio}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center text-gki-stone">
                                        Belum ada daftar staf pekerja yang tersedia.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="schedule" className="py-24 bg-gki-wood text-white text-center">
                <div className="container mx-auto px-6">
                    <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Jadwal</span>
                    <h2 className="text-5xl md:text-6xl font-serif mb-16">Waktu Ibadah</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {schedules.map((sch) => (
                            <div key={sch.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-gki-tan/40 transition-all duration-300 text-left">
                                <div className="relative h-48 w-full overflow-hidden bg-black/20">
                                    <img
                                        src={sch.image || '/luar.jpg'}
                                        alt={sch.type}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                    />
                                    <div className="absolute top-4 left-4 bg-gki-tan text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                                        {sch.day}
                                    </div>
                                </div>
                                <div className="p-8 space-y-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <span className="text-gki-tan font-mono uppercase text-base block mb-1">{sch.time} WIB</span>
                                        <h3 className="text-3xl font-serif mb-3 leading-snug">{sch.type}</h3>
                                        <p className="text-white/60 text-base leading-relaxed font-light mb-4 flex items-center gap-2 font-sans">
                                            <MapPin size={16} className="text-gki-tan shrink-0" />
                                            <span>{sch.location || 'Onsite'}</span>
                                        </p>
                                    </div>
                                    {sch.youtubeLink && (
                                        <a
                                            href={sch.youtubeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 w-full py-4 bg-red-600/90 hover:bg-red-700 text-white rounded-full font-bold text-sm tracking-wider uppercase transition-all font-sans cursor-pointer no-underline"
                                        >
                                            <Youtube size={16} />
                                            Nonton di YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-gki-cement text-gki-wood">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <span className="text-gki-tan font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Hubungi Kami</span>
                    <h2 className="text-5xl md:text-6xl font-serif mb-12">Kirim Pesan Kepada Kami</h2>

                    {contactSuccess && (
                        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                            {contactSuccess}
                        </div>
                    )}

                    <form onSubmit={handleContactSubmit} className="space-y-6 text-left bg-white p-8 md:p-12 rounded-3xl shadow-xl">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-base font-medium mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium mb-2">Alamat Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan text-base"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-base font-medium mb-2">Pesan Anda</label>
                            <textarea
                                className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gki-wood text-white py-4 rounded-lg font-bold hover:bg-gki-tan transition-all"
                        >
                            KIRIM PESAN
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer / Location Section */}
            <section className="py-24" style={{ backgroundColor: '#41301F' }}>
                <div className="container mx-auto px-6">
                    <div className="grid gap-12 lg:grid-cols-3 items-start">
                        <div className="rounded-3xl bg-white p-6 flex items-center justify-center">
                            <div className="w-full max-w-xs bg-white p-4 rounded-3xl shadow-2xl">
                                <p className="text-center text-xl font-extrabold text-gki-wood mb-4 tracking-wide">
                                    QRIS PERSEMBAHAN
                                </p>
                                <div className="aspect-square bg-white rounded-3xl flex items-center justify-center overflow-hidden">
                                    <img src="/qris-persembahan-gki.jpeg" alt="QR PERSEMBAHAN" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 grid gap-8">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
                                <h3 className="text-4xl text-white font-semibold mb-3">GKI Gejayan</h3>
                                <p className="text-sm text-white/70 leading-relaxed mb-3">
                                    {officeInfo.address || 'Jl. Affandi Gg. Jemb. Merah No.84D, Soropadan, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55283'}
                                </p>
                                <div className="space-y-1 text-xs text-white/80 mb-4">
                                    <p className="flex items-center gap-2"><Phone size={14} className="text-gki-tan" /> {officeInfo.phone}</p>
                                    <p className="flex items-center gap-2"><Mail size={14} className="text-gki-tan" /> {officeInfo.email}</p>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <a href="https://www.instagram.com/gkigejayan" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="https://www.tiktok.com/@gkigejayan" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-pink-600 text-white hover:bg-pink-500 transition-all">
                                        <span className="text-sm font-bold">TT</span>
                                    </a>
                                    <a href="https://www.facebook.com/gkigejayanofficial" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-sky-700 text-white hover:bg-sky-600 transition-all">
                                        <span className="text-sm font-bold">FB</span>
                                    </a>
                                    <a href="https://www.youtube.com/@multimediagkigejayan" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all">
                                        <Youtube size={20} />
                                    </a>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-gki-cement/10 bg-white/5 p-8 shadow-2xl">
                                <h3 className="text-4xl text-white font-semibold mb-3">The Grace</h3>
                                <p className="text-sm text-white/70 leading-relaxed mb-3">
                                    Lantai 3 Pakuwon Mall Jogja, Jl. Ring Road Utara, Kaliwaru, Condongcatur, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
                                </p>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <a href="https://www.instagram.com/thegracegki/" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="https://www.tiktok.com/@thegracegki" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-pink-600 text-white hover:bg-pink-500 transition-all">
                                        <span className="text-sm font-bold">TT</span>
                                    </a>
                                    <a href="https://www.facebook.com/thegracegki" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all">
                                        <span className="text-sm font-bold">FB</span>
                                    </a>
                                    <a href="https://www.youtube.com/@thegracegki" className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all">
                                        <Youtube size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 w-full text-center block">
                        <p className="text-sm font-medium tracking-wide text-white/50 italic inline-block mx-auto">
                            @GKI Gejayan | by Natanael Nainggolan
                        </p>
                    </div>
                </div>
            </section>

            {/* Volunteer Modal */}
            {vModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-gki-wood">
                        <button onClick={() => setVModalOpen(false)} className="absolute top-4 right-4 text-gki-stone hover:text-black transition-all">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-serif mb-2">Pendaftaran Relawan</h2>
                        <p className="text-sm text-gki-stone mb-6">Bergabung melayani di komisi: <strong className="text-gki-tan">{selectedMinistry?.title}</strong></p>

                        {volunteerSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                {volunteerSuccess}
                            </div>
                        )}

                        <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gki-tan outline-none"
                                    value={volunteerForm.fullName}
                                    onChange={(e) => setVolunteerForm({ ...volunteerForm, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Alamat Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gki-tan outline-none"
                                    value={volunteerForm.email}
                                    onChange={(e) => setVolunteerForm({ ...volunteerForm, email: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gki-wood text-white py-3 rounded-lg font-bold hover:bg-gki-tan transition-all mt-4"
                            >
                                DAFTAR SEKARANG
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Document & Detail Modal */}
            {selectedEventModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative text-gki-wood overflow-hidden my-8 border border-white/20">
                        {/* Header Image */}
                        <div className="relative h-64 bg-gki-wood overflow-hidden">
                            <img
                                src={selectedEventModal.imageUrl || '/luar.jpg'}
                                alt={selectedEventModal.title}
                                className="w-full h-full object-cover brightness-75"
                            />
                            <button
                                onClick={() => setSelectedEventModal(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-6 right-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md inline-block mb-2 ${selectedEventModal.isPast ? 'bg-amber-700' : 'bg-emerald-700'
                                    }`}>
                                    {selectedEventModal.isPast ? 'Dokumentasi Kegiatan' : 'Kegiatan Mendatang'}
                                </span>
                                <h2 className="text-2xl md:text-4xl font-serif text-white leading-tight drop-shadow-md">
                                    {selectedEventModal.title}
                                </h2>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div className="flex flex-wrap gap-4 text-sm font-semibold text-gki-tan border-b border-gki-tan/15 pb-4">
                                <span className="flex items-center gap-1.5"><Clock size={16} /> {selectedEventModal.date}</span>
                                {selectedEventModal.location && (
                                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {selectedEventModal.location}</span>
                                )}
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-gki-tan mb-2">Deskripsi & Dokumentasi</h4>
                                <p className="text-gki-wood text-base leading-relaxed whitespace-pre-line font-light">
                                    {selectedEventModal.content || selectedEventModal.description}
                                </p>
                            </div>

                            {/* Attached Document Download Section */}
                            {selectedEventModal.documentUrl && (
                                <div className="bg-gki-cream/30 border border-gki-tan/30 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gki-wood text-gki-tan flex items-center justify-center shrink-0 shadow-sm">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-gki-tan block">Dokumen Lampiran</span>
                                            <p className="text-sm font-semibold text-gki-wood truncate max-w-xs sm:max-w-sm">
                                                {selectedEventModal.documentTitle || 'Berkas Dokumen Kegiatan.pdf'}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={selectedEventModal.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gki-tan text-white hover:bg-gki-wood px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md shrink-0 no-underline"
                                    >
                                        <Download size={16} /> Unduh Dokumen
                                    </a>
                                </div>
                            )}

                            {/* Google Photos Album Section */}
                            {selectedEventModal.googlePhotosUrl && (
                                <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <ImageIcon size={24} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block">Album Dokumentasi Foto</span>
                                            <p className="text-sm font-semibold text-blue-950">
                                                Lihat Seluruh Foto Kegiatan (Google Photos)
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={selectedEventModal.googlePhotosUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md shrink-0 no-underline"
                                    >
                                        <ExternalLink size={16} /> Buka Album Foto
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gki-cream/20 border-t border-gki-tan/10 text-right">
                            <button
                                onClick={() => setSelectedEventModal(null)}
                                className="px-6 py-2.5 bg-gki-wood text-white rounded-full font-bold text-sm hover:bg-gki-tan transition-all cursor-pointer"
                            >
                                TUTUP
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={homePageContent} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/banner-photos" element={<AdminDashboard content={<ManageHeroPhotos />} />} />
                        <Route path="/admin/staff" element={<AdminDashboard content={<ManageStaff />} />} />
                        <Route path="/admin/schedules" element={<AdminDashboard content={<ManageSchedules />} />} />
                        <Route path="/admin/pastors" element={<AdminDashboard content={<ManagePastors />} />} />
                        <Route path="/admin/ministries" element={<AdminDashboard content={<ManageMinistries />} />} />
                        <Route path="/admin/events" element={<AdminDashboard content={<ManageEvents />} />} />
                        <Route path="/admin/contacts" element={<AdminDashboard content={<ManageContacts />} />} />
                        <Route path="/admin/volunteers" element={<AdminDashboard content={<ManageVolunteers />} />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
