import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, X, FileText, MapPin, CheckCircle, Clock, Upload, Image as ImageIcon, ExternalLink } from 'lucide-react';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
        content: '',
        imageUrl: '',
        documentUrl: '',
        documentTitle: '',
        googlePhotosUrl: '',
        location: '',
        isPast: false,
        order: 0
    });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            date: '',
            description: '',
            content: '',
            imageUrl: '',
            documentUrl: '',
            documentTitle: '',
            googlePhotosUrl: '',
            location: '',
            isPast: false,
            order: 0
        });
    };

    const openEditModal = (ev) => {
        setEditingEvent(ev);
        setFormData({
            title: ev.title || '',
            date: ev.date || '',
            description: ev.description || '',
            content: ev.content || '',
            imageUrl: ev.imageUrl || '',
            documentUrl: ev.documentUrl || '',
            documentTitle: ev.documentTitle || '',
            googlePhotosUrl: ev.googlePhotosUrl || '',
            location: ev.location || '',
            isPast: ev.isPast || false,
            order: ev.order || 0
        });
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            if (editingEvent) {
                await axios.put(`/api/events/${editingEvent.id}`, formData, config);
            } else {
                await axios.post('/api/events', formData, config);
            }
            setIsModalOpen(false);
            resetForm();
            fetchEvents();
        } catch (err) {
            alert('Operasi gagal, periksa data yang dimasukkan.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
        try {
            await axios.delete(`/api/events/${id}`, { headers: { 'x-auth-token': token } });
            fetchEvents();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-gki-wood">Kelola Kegiatan & Dokumentasi</h2>
                    <p className="text-gki-stone text-sm mt-1">Kelola event mendatang, dokumentasi kegiatan, foto dari perangkat, dan link Google Photos.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gki-wood text-white px-6 py-3 rounded-full hover:bg-gki-tan transition-all shadow-lg font-bold text-sm tracking-wider uppercase cursor-pointer"
                >
                    <Plus size={20} /> TAMBAH KEGIATAN
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {events.map((ev) => (
                    <div key={ev.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gki-cement/20 flex flex-col justify-between">
                        <div>
                            <div className="h-48 bg-gki-cement relative">
                                {ev.imageUrl ? (
                                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gki-stone opacity-40">No Image</div>
                                )}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${ev.isPast ? 'bg-amber-700' : 'bg-green-700'}`}>
                                        {ev.isPast ? 'Dokumentasi / Selesai' : 'Mendatang'}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => openEditModal(ev)} className="p-2 bg-white/90 rounded-full text-gki-wood hover:bg-white shadow-sm cursor-pointer">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(ev.id)} className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-sm cursor-pointer">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-gki-tan text-xs font-bold uppercase tracking-widest mb-1">
                                    <Clock size={14} /> {ev.date}
                                </div>
                                <h3 className="text-xl font-serif text-gki-wood mb-2">{ev.title}</h3>
                                {ev.location && (
                                    <p className="text-gki-stone text-xs flex items-center gap-1 mb-3">
                                        <MapPin size={14} className="text-gki-tan shrink-0" /> {ev.location}
                                    </p>
                                )}
                                <p className="text-gki-stone text-sm line-clamp-2 mb-4">{ev.description}</p>

                                <div className="space-y-2">
                                    {ev.documentUrl && (
                                        <div className="flex items-center gap-2 bg-gki-cream/20 p-2.5 rounded-xl border border-gki-tan/20 text-xs text-gki-wood font-medium">
                                            <FileText size={16} className="text-gki-tan shrink-0" />
                                            <span className="truncate">{ev.documentTitle || 'Dokumen Lampiran'}</span>
                                        </div>
                                    )}
                                    {ev.googlePhotosUrl && (
                                        <a href={ev.googlePhotosUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-xl border border-blue-200 text-xs text-blue-800 font-medium hover:underline">
                                            <ImageIcon size={16} className="text-blue-600 shrink-0" />
                                            <span className="truncate">Album Google Photos: {ev.googlePhotosUrl}</span>
                                            <ExternalLink size={12} className="ml-auto shrink-0" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gki-stone hover:text-black">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-serif text-gki-wood mb-6">{editingEvent ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status Kegiatan</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                                        <input
                                            type="radio"
                                            name="isPast"
                                            checked={!formData.isPast}
                                            onChange={() => setFormData({ ...formData, isPast: false })}
                                        />
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Kegiatan Mendatang</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                                        <input
                                            type="radio"
                                            name="isPast"
                                            checked={formData.isPast}
                                            onChange={() => setFormData({ ...formData, isPast: true })}
                                        />
                                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">Kegiatan Sudah Lewat (Dokumentasi)</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Judul Kegiatan</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tanggal / Waktu</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="Minggu, 5 April 2026" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Lokasi</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Gedung Utama / Online" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi Ringkas</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="2" placeholder="Ringkasan singkat kegiatan..."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Detail Dokumentasi / Konten Lengkap</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows="4" placeholder="Detail narasi kegiatan, rundown, atau laporan dokumentasi..."></textarea>
                            </div>

                            {/* Option 1: Choose File from Device */}
                            <div className="p-4 bg-gki-cream/30 border border-gki-tan/30 rounded-xl space-y-3">
                                <label className="block text-sm font-bold text-gki-wood">Foto Sampul / Poster Kegiatan</label>
                                
                                <div>
                                    <span className="text-xs font-semibold text-gki-stone block mb-1">A. Pilih File Gambar dari Perangkat (Laptop/HP):</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gki-wood file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gki-wood file:text-white hover:file:bg-gki-tan cursor-pointer"
                                    />
                                </div>

                                <div className="relative flex py-1 items-center">
                                    <div className="flex-grow border-t border-gki-tan/20"></div>
                                    <span className="flex-shrink mx-3 text-xs text-gki-stone uppercase font-bold">atau</span>
                                    <div className="flex-grow border-t border-gki-tan/20"></div>
                                </div>

                                <div>
                                    <span className="text-xs font-semibold text-gki-stone block mb-1">B. URL Gambar (Link External):</span>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg text-sm bg-white"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="/dalam.png atau https://..."
                                    />
                                </div>

                                {formData.imageUrl && (
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-xs font-semibold text-gki-stone">Preview Foto:</span>
                                        <img src={formData.imageUrl} alt="Preview" className="h-16 w-24 object-cover rounded-lg border shadow-sm" />
                                    </div>
                                )}
                            </div>

                            {/* Google Photos Album Link */}
                            <div>
                                <label className="block text-sm font-medium mb-1">URL Album Google Photos / Drive (Semua Foto)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg text-sm"
                                    value={formData.googlePhotosUrl}
                                    onChange={(e) => setFormData({ ...formData, googlePhotosUrl: e.target.value })}
                                    placeholder="https://photos.google.com/share/..."
                                />
                                <p className="text-xs text-gki-stone mt-1">Masukkan link album foto lengkap dari Google Photos agar pengunjung dapat melihat seluruh galeri kegiatan.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">URL Dokumen Lampiran (PDF/Drive)</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.documentUrl} onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })} placeholder="https://... (link PDF)" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Judul Dokumen Lampiran</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.documentTitle} onChange={(e) => setFormData({ ...formData, documentTitle: e.target.value })} placeholder="Warta & Panduan Tata Ibadah.pdf" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Urutan Tampil (Order)</label>
                                <input type="number" className="w-full px-4 py-2 border rounded-lg" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
                            </div>

                            <button type="submit" className="w-full bg-gki-wood text-white py-3 rounded-lg font-bold hover:bg-gki-tan transition-all mt-4 cursor-pointer">
                                {editingEvent ? 'SIMPAN PERUBAHAN' : 'TAMBAH KEGIATAN'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEvents;
