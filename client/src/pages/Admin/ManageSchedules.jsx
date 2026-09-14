import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({ type: '', time: '', day: '', location: '', youtubeLink: '', image: '', order: 1 });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const res = await axios.get('/api/schedules');
            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setEditingSchedule(null);
        setFormData({ type: '', time: '', day: '', location: '', youtubeLink: '', image: '', order: schedules.length + 1 });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxDim = 1200;
                let width = img.width;
                let height = img.height;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                setFormData(prev => ({
                    ...prev,
                    image: compressedBase64
                }));
            };
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            if (editingSchedule) {
                await axios.put(`/api/schedules/${editingSchedule.id}`, formData, config);
            } else {
                await axios.post('/api/schedules', formData, config);
            }
            setIsModalOpen(false);
            resetForm();
            fetchSchedules();
        } catch (err) {
            console.error('Submit error:', err.response?.data || err);
            alert('Operation failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/schedules/${id}`, { headers: { 'x-auth-token': token } });
            fetchSchedules();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const openEdit = (sch) => {
        setEditingSchedule(sch);
        setFormData({ 
            type: sch.type, 
            time: sch.time, 
            day: sch.day, 
            location: sch.location, 
            youtubeLink: sch.youtubeLink || '', 
            image: sch.image || '',
            order: sch.order !== undefined && sch.order !== null ? sch.order : 1
        });
        setIsModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-serif text-gki-wood">Kelola Jadwal Ibadah</h2>
                    <p className="text-gki-stone text-sm mt-1">Atur urutan tampilan jadwal ibadah dan informasi pelaksanaan.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gki-wood text-white px-6 py-3 rounded-full hover:bg-gki-tan transition-all shadow-lg font-bold"
                >
                    <Plus size={20} /> TAMBAH JADWAL
                </button>
            </div>

            <div className="grid gap-4">
                {schedules.map((sch, idx) => (
                    <div key={sch.id} className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center border border-gki-cement/20">
                        <div className="flex items-center gap-6">
                            <img src={sch.image || '/luar.jpg'} alt={sch.type} className="w-16 h-16 rounded-xl object-cover bg-gki-cement border" />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2.5 py-0.5 bg-gki-tan/10 text-gki-tan text-xs font-bold rounded-full border border-gki-tan/20">
                                        Urutan #{sch.order !== undefined && sch.order !== null ? sch.order : idx + 1}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif text-gki-wood">{sch.type}</h3>
                                <p className="text-gki-stone text-base">{sch.day}, {sch.time} - {sch.location}</p>
                                {sch.youtubeLink && (
                                    <p className="text-red-600 text-xs font-semibold mt-1">📺 YouTube: {sch.youtubeLink}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openEdit(sch)} className="p-2 text-gki-stone hover:text-gki-tan transition-all" title="Edit Jadwal">
                                <Edit2 size={20} />
                            </button>
                            <button onClick={() => handleDelete(sch.id)} className="p-2 text-red-400 hover:text-red-500 transition-all" title="Hapus Jadwal">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gki-stone">
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-serif text-gki-wood mb-6">{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-base font-medium mb-1">Urutan Tampil (Order Number)</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                                    required
                                />
                                <p className="text-xs text-gki-stone mt-1">Urutan angka paling kecil (misal: 1, 2, 3) akan berada di paling depan.</p>
                            </div>

                            <div>
                                <label className="block text-base font-medium mb-1">Tipe Ibadah</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-base font-medium mb-1">Hari</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                        value={formData.day}
                                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-base font-medium mb-1 font-sans">Waktu</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-medium mb-1">Lokasi</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium mb-1">Link YouTube (Live/Rekaman)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gki-tan"
                                    value={formData.youtubeLink}
                                    onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium mb-1">Foto Ibadah (Image dari Perangkat)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm block"
                                    onChange={handleImageChange}
                                />
                                {formData.image && (
                                    <div className="mt-3 relative inline-block">
                                        <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-gki-cement" />
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs font-bold leading-none cursor-pointer border-0"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gki-wood text-white py-3 rounded-lg font-bold hover:bg-gki-tan transition-all mt-4 cursor-pointer"
                            >
                                {editingSchedule ? 'SIMPAN PERUBAHAN' : 'TAMBAH JADWAL'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSchedules;
