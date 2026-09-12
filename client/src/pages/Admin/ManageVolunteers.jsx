import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Trash2, User, Mail, Award } from 'lucide-react';

const ManageVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('/api/ministries/volunteers/list', config);
            setVolunteers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pendaftaran relawan ini?')) return;
        try {
            await axios.delete(`/api/ministries/volunteers/${id}`, { headers: { 'x-auth-token': token } });
            fetchVolunteers();
        } catch (err) {
            alert('Gagal menghapus pendaftaran');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-gki-wood">Kelola Pendaftaran Relawan (Layanan)</h2>
            </div>

            <div className="grid gap-6">
                {volunteers.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gki-cement/20 text-center text-gki-stone opacity-60">
                        Tidak ada pendaftaran relawan saat ini.
                    </div>
                ) : (
                    volunteers.map((vol) => (
                        <div key={vol.id} className="bg-white p-6 rounded-2xl shadow-md border border-gki-cement/20 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gki-wood/10 text-gki-wood flex items-center justify-center font-bold">
                                            <User size={16} />
                                        </div>
                                        <h3 className="text-lg font-serif text-gki-wood font-bold">{vol.fullName}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-gki-stone text-sm">
                                        <Mail size={14} className="text-gki-tan" />
                                        <span>{vol.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm bg-gki-cream/30 text-gki-wood px-3 py-1 rounded-full w-fit">
                                        <Award size={14} className="text-gki-tan" />
                                        <span className="font-semibold text-xs">Pilihan Pelayanan: {vol.Ministry?.title || `ID Pelayanan: ${vol.ministryId}`}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(vol.id)}
                                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Hapus Pendaftaran"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="text-right text-[10px] text-gki-stone/50 mt-1">
                                Mendaftar pada: {new Date(vol.createdAt).toLocaleString('id-ID')}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageVolunteers;
