import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Calendar, Music, LogOut, Home, Star, Mail, Award, Image as ImageIcon, Building } from 'lucide-react';
import ManageSchedules from './ManageSchedules';
import ManagePastors from './ManagePastors';
import ManageMinistries from './ManageMinistries';

const Dashboard = ({ content }) => {
    const { logout, admin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gki-cement flex">
            {/* Sidebar */}
            <div className="w-64 bg-gki-wood text-white p-6 flex flex-col fixed h-full">
                <h1 className="text-2xl font-serif mb-10">GKI Admin</h1>
                <nav className="flex-1 space-y-2 overflow-y-auto">
                    <Link to="/admin" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
                        <Home size={18} /> Dashboard
                    </Link>
                    <Link to="/admin/banner-photos" className="flex items-center gap-3 p-3 bg-gki-tan text-white font-bold rounded-lg transition-all shadow-md">
                        <ImageIcon size={18} /> Foto Banner Utama
                    </Link>
                    <Link to="/admin/staff" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all text-gki-tan font-bold">
                        <Building size={18} /> Kantor & Staf Pekerja
                    </Link>
                    <Link to="/admin/events" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
                        <Star size={18} /> Event & Dokumentasi
                    </Link>
                    <Link to="/admin/schedules" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
                        <Calendar size={18} /> Jadwal Ibadah
                    </Link>
                    <Link to="/admin/pastors" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
                        <Users size={18} /> Profil Pendeta
                    </Link>
                    <Link to="/admin/ministries" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
                        <Music size={18} /> Komisi Pelayanan
                    </Link>
                    <hr className="border-white/15 my-2" />
                    <Link to="/admin/contacts" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
                        <Mail size={18} /> Pesan Masuk
                    </Link>
                    <Link to="/admin/volunteers" className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all">
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
            <div className="flex-1 ml-64 p-12 overflow-y-auto flex justify-center">
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
                                <div className="bg-gradient-to-br from-gki-wood to-gki-wood/90 text-white p-8 rounded-2xl shadow-xl border border-gki-tan/30 relative overflow-hidden">
                                    <div className="absolute top-3 right-3 bg-gki-tan text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                                        Khusus Foto
                                    </div>
                                    <ImageIcon className="text-gki-tan mb-4" size={36} />
                                    <h3 className="text-2xl font-serif text-white mb-2">Foto Banner Utama</h3>
                                    <p className="text-white/80 text-sm mb-6">Upload & ganti foto slide utama beranda secara langsung dari laptop/HP Anda.</p>
                                    <Link to="/admin/banner-photos" className="inline-block bg-gki-tan text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-white hover:text-gki-wood transition-all shadow-md uppercase">
                                        📷 GANTI FOTO
                                    </Link>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gki-tan/30">
                                    <Building className="text-gki-tan mb-4" size={32} />
                                    <h3 className="text-2xl font-serif text-gki-wood mb-2">Kantor & Staf Pekerja</h3>
                                    <p className="text-gki-stone text-base mb-6">Kelola nomor telepon kantor, Gmail kantor, jam kerja, & daftar staf pekerja.</p>
                                    <Link to="/admin/staff" className="inline-block bg-gki-tan text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest hover:bg-gki-wood transition-all shadow-md">
                                        KELOLA KANTOR & STAF
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
