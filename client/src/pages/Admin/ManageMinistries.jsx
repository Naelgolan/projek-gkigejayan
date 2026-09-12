import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const ManageMinistries = () => {
    const [ministries, setMinistries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMin, setEditingMin] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', icon: 'music' });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchMinistries();
    }, []);

    const fetchMinistries = async () => {
        try {
            const res = await axios.get('/api/ministries');
            setMinistries(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': token } };
            if (editingMin) {
                await axios.put(`/api/ministries/${editingMin.id}`, formData, config);
            } else {
                await axios.post('/api/ministries', formData, config);
            }
            setIsModalOpen(false);
            setEditingMin(null);
            setFormData({ title: '', description: '', icon: 'music' });
            fetchMinistries();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/ministries/${id}`, { headers: { 'x-auth-token': token } });
            fetchMinistries();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-serif text-gki-wood">Kelola Pelayanan</h2>
                <button
                    onClick={() => { setEditingMin(null); setFormData({ title: '', description: '', icon: 'music' }); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-gki-wood text-white px-6 py-3 rounded-full hover:bg-gki-tan transition-all shadow-lg font-bold"
                >
                    <Plus size={20} /> TAMBAH PELAYANAN
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ministries.map((min) => (
                    <div key={min.id} className="bg-white p-8 rounded-2xl shadow-md border border-gki-cement/20 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 bg-gki-tan/10 text-gki-tan rounded-lg flex items-center justify-center mb-4">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-2xl font-serif text-gki-wood mb-2">{min.title}</h3>
                            <p className="text-gki-stone text-base line-clamp-3">{min.description}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                            <button onClick={() => { setEditingMin(min); setFormData(min); setIsModalOpen(true); }} className="p-2 text-gki-stone hover:text-gki-tan transition-all">
                                <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDelete(min.id)} className="p-2 text-red-400 hover:text-red-500 transition-all">
                                <Trash2 size={18} />
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
                        <h2 className="text-3xl font-serif text-gki-wood mb-6">{editingMin ? 'Edit Pelayanan' : 'Tambah Pelayanan'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-base font-medium mb-1">Judul Pelayanan</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-base font-medium mb-1">Deskripsi</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="4" required></textarea>
                            </div>
                            <button type="submit" className="w-full bg-gki-wood text-white py-3 rounded-lg font-bold hover:bg-gki-tan transition-all mt-4">
                                {editingMin ? 'SIMPAN PERUBAHAN' : 'TAMBAH PELAYANAN'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMinistries;
