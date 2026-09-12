import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const ManagePastors = () => {
    const [pastors, setPastors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPastor, setEditingPastor] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: '', bio: '', image: '', order: 0 });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchPastors();
    }, []);

    const fetchPastors = async () => {
        try {
            const res = await axios.get('/api/pastors');
            setPastors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            if (editingPastor) {
                await axios.put(`/api/pastors/${editingPastor.id}`, formData, config);
            } else {
                await axios.post('/api/pastors', formData, config);
            }
            setIsModalOpen(false);
            setEditingPastor(null);
            setFormData({ name: '', role: '', bio: '', image: '', order: 0 });
            fetchPastors();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/pastors/${id}`, { headers: { 'x-auth-token': token } });
            fetchPastors();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-gki-wood">Kelola Pendeta</h2>
                <button
                    onClick={() => { setEditingPastor(null); setFormData({ name: '', role: '', bio: '', image: '', order: 0 }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gki-wood text-white px-6 py-3 rounded-full hover:bg-gki-tan transition-all shadow-lg font-bold"
                >
                    <Plus size={20} /> TAMBAH PENDETA
                </button>
            </div>

            <div className="grid gap-4">
                {pastors.map((p) => (
                    <div key={p.id} className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center border border-gki-cement/20">
                        <div className="flex items-center gap-6">
                            <img src={p.image || '/logo polos.PNG'} alt={p.name} className="w-16 h-16 rounded-full object-cover bg-gki-cement" />
                            <div>
                                <h3 className="text-xl font-serif text-gki-wood">{p.name}</h3>
                                <p className="text-gki-tan text-sm font-medium">{p.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditingPastor(p); setFormData({ name: p.name, role: p.role, bio: p.bio, image: p.image || '', order: p.order || 0 }); setIsModalOpen(true); }} className="p-2 text-gki-stone hover:text-gki-tan transition-all">
                                <Edit2 size={20} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-500 transition-all">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gki-stone">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-serif text-gki-wood mb-6">{editingPastor ? 'Edit Pendeta' : 'Tambah Pendeta'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Jabatan (Role)</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Deskripsi/Profil Singkat (Bio)</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows="3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL Foto (Image)</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Urutan Tampil (Order)</label>
                                <input type="number" className="w-full px-4 py-2 border rounded-lg" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
                            </div>
                            <button type="submit" className="w-full bg-gki-wood text-white py-3 rounded-lg font-bold hover:bg-gki-tan transition-all mt-4">
                                {editingPastor ? 'SIMPAN PERUBAHAN' : 'TAMBAH PENDETA'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePastors;
