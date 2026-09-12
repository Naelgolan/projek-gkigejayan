import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Upload, Image as ImageIcon, CheckCircle, Save, Clock, MapPin } from 'lucide-react';

const ManageHeroPhotos = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [previews, setPreviews] = useState({});
    const [savingId, setSavingId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/events');
            // Filter non-past events (active hero slides) first, or all events
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (eventId, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [eventId]: reader.result }));
                setSelectedFiles(prev => ({ ...prev, [eventId]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSavePhoto = async (ev) => {
        try {
            setSavingId(ev.id);
            const newImageUrl = selectedFiles[ev.id] || ev.imageUrl;
            const updatedData = { ...ev, imageUrl: newImageUrl };

            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`/api/events/${ev.id}`, updatedData, config);

            setSuccessMsg(`Foto banner "${ev.title}" berhasil diperbarui!`);
            setTimeout(() => setSuccessMsg(''), 4000);
            
            // Clean up preview state for this event
            setSelectedFiles(prev => {
                const next = { ...prev };
                delete next[ev.id];
                return next;
            });
            fetchEvents();
        } catch (err) {
            alert('Gagal menyimpan foto banner. Silakan coba lagi.');
        } finally {
            setSavingId(null);
        }
    };

    const handleTitleChange = (eventId, newTitle) => {
        setEvents(events.map(ev => ev.id === eventId ? { ...ev, title: newTitle } : ev));
    };

    const handleDateChange = (eventId, newDate) => {
        setEvents(events.map(ev => ev.id === eventId ? { ...ev, date: newDate } : ev));
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gki-wood text-gki-tan rounded-xl">
                        <ImageIcon size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif text-gki-wood">Kelola Foto Banner & Hero Slider</h2>
                        <p className="text-gki-stone text-sm">Ganti foto slide utama beranda secara langsung dengan mengunggah gambar dari laptop atau HP Anda.</p>
                    </div>
                </div>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-sm animate-fade-in">
                    <CheckCircle size={20} className="text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-gki-stone">Memuat daftar banner...</div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2">
                    {events.map((ev, index) => {
                        const currentPreview = previews[ev.id] || ev.imageUrl;
                        const hasNewFile = !!selectedFiles[ev.id];

                        return (
                            <div key={ev.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gki-tan/20 flex flex-col justify-between">
                                {/* Preview Banner Box */}
                                <div className="relative h-64 bg-gki-wood overflow-hidden group">
                                    {currentPreview ? (
                                        <img src={currentPreview} alt={ev.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 bg-gki-wood">
                                            <ImageIcon size={48} className="mb-2 opacity-50" />
                                            <span>Belum Ada Foto Banner</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                                        <span className="px-3 py-1 bg-gki-tan text-white text-xs font-bold uppercase rounded-full w-fit mb-2 shadow-md">
                                            Slide #{index + 1} {ev.isPast ? '(Arsip)' : '(Banner Utam)'}
                                        </span>
                                        <h3 className="text-2xl font-serif text-white leading-snug drop-shadow-md">{ev.title}</h3>
                                        <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                            <Clock size={12} /> {ev.date}
                                        </p>
                                    </div>
                                </div>

                                {/* Form Action Box */}
                                <div className="p-6 space-y-4 bg-gki-cream/10">
                                    <div>
                                        <label className="block text-xs font-bold text-gki-wood uppercase tracking-wider mb-1">
                                            Judul Slide Banner
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-sm bg-white font-serif text-gki-wood font-bold"
                                            value={ev.title}
                                            onChange={(e) => handleTitleChange(ev.id, e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gki-wood uppercase tracking-wider mb-1">
                                            Tanggal / Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg text-sm bg-white text-gki-stone"
                                            value={ev.date}
                                            onChange={(e) => handleDateChange(ev.id, e.target.value)}
                                        />
                                    </div>

                                    {/* Upload Button Box */}
                                    <div className="p-4 bg-white border border-gki-tan/30 rounded-xl space-y-3 shadow-inner">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-gki-wood">📷 Upload Foto Banner Baru:</span>
                                            {hasNewFile && (
                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                    Foto Baru Dipilih!
                                                </span>
                                            )}
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            id={`file-input-${ev.id}`}
                                            onChange={(e) => handleFileChange(ev.id, e)}
                                            className="w-full text-xs text-gki-wood file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gki-wood file:text-white hover:file:bg-gki-tan cursor-pointer"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleSavePhoto(ev)}
                                        disabled={savingId === ev.id}
                                        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                            hasNewFile 
                                                ? 'bg-emerald-700 hover:bg-emerald-800 text-white animate-pulse' 
                                                : 'bg-gki-wood hover:bg-gki-tan text-white'
                                        }`}
                                    >
                                        <Save size={18} />
                                        {savingId === ev.id ? 'MENYIMPAN...' : hasNewFile ? 'SIMPAN FOTO BARU INI' : 'SIMPAN PERUBAHAN BANNER'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ManageHeroPhotos;
