import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Trash2, Mail } from 'lucide-react';

const ManageContacts = () => {
    const [messages, setMessages] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const config = { headers: { 'x-auth-token': token } };
            const res = await axios.get('/api/contacts', config);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pesan ini?')) return;
        try {
            await axios.delete(`/api/contacts/${id}`, { headers: { 'x-auth-token': token } });
            fetchMessages();
        } catch (err) {
            alert('Gagal menghapus pesan');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-gki-wood">Kelola Hubungi Kami (Pesan Masuk)</h2>
            </div>

            <div className="grid gap-6">
                {messages.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-md border border-gki-cement/20 text-center text-gki-stone opacity-60">
                        Tidak ada pesan masuk.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-md border border-gki-cement/20 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-serif text-gki-wood font-bold">{msg.name}</h3>
                                    <div className="flex items-center gap-2 text-gki-tan text-sm font-medium mt-1">
                                        <Mail size={14} />
                                        <span>{msg.email}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Hapus Pesan"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="bg-gki-cement/10 p-4 rounded-xl text-gki-stone text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                            </div>
                            <div className="text-right text-[10px] text-gki-stone/50 mt-3">
                                {new Date(msg.createdAt).toLocaleString('id-ID')}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageContacts;
