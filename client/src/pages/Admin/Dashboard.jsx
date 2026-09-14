import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Music, LogOut, Home, Star, Mail, Award, Image as ImageIcon, Building, Menu, X } from 'lucide-react';
import ManageSchedules from './ManageSchedules';
import ManagePastors from './ManagePastors';
import ManageMinistries from './ManageMinistries';

const Dashboard = ({ content }) => {
    const { logout, admin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return isActive
            ? "flex items-center gap-3 p-3 bg-gki-tan text-white font-bold rounded-lg transition-all shadow-md"
            : "flex items-center gap-3 p-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all";
    };

    return (
        <div className="min-h-screen bg-gki-cement flex flex-col md:flex-row">
            {/* Mobile Top Navigation */}
            <div className="md:hidden bg-gki-wood text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <Link to="/" className="flex items-center gap-2 text-white no-underline font-serif text-lg font-semibold">
                    <img src="/logo polos.PNG" alt="Logo" className="h-7 invert" />
                    <span>GKI Gejayan Admin</span>
                </Link>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 text-white bg-transparent border-0 cursor-pointer"
                    aria-label="Toggle Menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`
                w-full md:w-64 bg-gki-wood text-white p-6 flex flex-col fixed md:h-full z-40 transition-all duration-300
                ${mobileMenuOpen ? 'top-14 left-0 h-[calc(100vh-3.5rem)]' : '-left-full md:left-0 top-0 h-full'}
            `}>
                <Link
                    to="/"
                    className="hidden md:flex items-center gap-3 mb-10 text-white hover:opacity-90 transition-opacity no-underline group cursor-pointer"
                    title="Kembali ke Beranda Utama GKI Gejayan"
                >
                    <img src="/logo polos.PNG" alt="Logo" className="h-8 invert" />
                    <span className="text-xl font-serif font-semibold tracking-wide">GKI Gejayan</span>
                </Link>
                <nav className="flex-1 space-y-2 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/admin" className={getNavLinkClass('/admin')}>
                        <Home size={18} /> Dashboard
                    </Link>
                    <Link to="/admin/banner-photos" className={getNavLinkClass('/admin/banner-photos')}>
                        <ImageIcon size={18} /> Foto Banner Utama
                    </Link>
                    <Link to="/admin/staff" className={getNavLinkClass('/admin/staff')}>
                        <Building size={18} /> Kantor & Staf Pekerja
                    </Link>
                    <Link to="/admin/events" className={getNavLinkClass('/admin/events')}>
                        <Star size={18} /> Event & Dokumentasi
                    </Link>
                    <Link to="/admin/schedules" className={getNavLinkClass('/admin/schedules')}>
                        <Calendar size={18} /> Jadwal Ibadah
                    </Link>
                    <Link to="/admin/pastors" className={getNavLinkClass('/admin/pastors')}>
                        <Users size={18} /> Profil Pendeta
                    </Link>
                    <Link to="/admin/ministries" className={getNavLinkClass('/admin/ministries')}>
                        <Music size={18} /> Komisi Pelayanan
                    </Link>
                    <hr className="border-white/15 my-2" />
                    <Link to="/admin/contacts" className={getNavLinkClass('/admin/contacts')}>
                        <Mail size={18} /> Pesan Masuk
                    </Link>
                    <Link to="/admin/volunteers" className={getNavLinkClass('/admin/volunteers')}>
                        <Award size={18} /> Relawan Layanan
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 text-red-400 hover:text-red-300 transition-all mt-auto pt-4 border-t border-white/15"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 p-4 sm:p-8 md:p-12 overflow-y-auto flex justify-center">
                <div className="w-full max-w-6xl">
                    {content ? content : (
                        <>
                            <header className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-5xl font-serif text-gki-wood mb-2">Dashboard Overview</h2>
                                    <p className="text-gki-stone text-lg">Selamat datang kembali, {admin?.email}</p>
                                </div>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <ImageIcon className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Foto Banner Utama</h3>
                                    <p className="text-gki-stone text-base mb-6">Upload & ganti foto slide utama beranda secara langsung dari laptop/HP Anda.</p>
                                    <Link to="/admin/banner-photos" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <Building className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Kantor & Staf Pekerja</h3>
                                    <p className="text-gki-stone text-base mb-6">Kelola nomor telepon kantor, Gmail kantor, jam kerja, & daftar staf pekerja.</p>
                                    <Link to="/admin/staff" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <Star className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Event & Dokumentasi</h3>
                                    <p className="text-gki-stone text-base mb-6">Kelola seluruh detail kegiatan dan arsip dokumentasi.</p>
                                    <Link to="/admin/events" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <Calendar className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Jadwal Ibadah</h3>
                                    <p className="text-gki-stone text-base mb-6">Kelola waktu dan lokasi ibadah rutin.</p>
                                    <Link to="/admin/schedules" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <Users className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Daftar Pendeta</h3>
                                    <p className="text-gki-stone text-base mb-6">Atur profil dan jabatan pendeta.</p>
                                    <Link to="/admin/pastors" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <Music className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Komisi Pelayanan</h3>
                                    <p className="text-gki-stone text-base mb-6">Kelola informasi komisi pelayanan.</p>
                                    <Link to="/admin/ministries" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl">
                                    <Mail className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Pesan Jemaat</h3>
                                    <p className="text-gki-stone text-base mb-6">Kelola pesan hubungi kami.</p>
                                    <Link to="/admin/contacts" className="inline-block bg-gki-wood text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-tan transition-all">
                                        KELOLA
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
