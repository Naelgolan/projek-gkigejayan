import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, Phone, Mail, Clock, MapPin, Edit, Trash2, Plus, Save, Building, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageStaff = () => {
    const { admin } = useContext(AuthContext);
    const [officeInfo, setOfficeInfo] = useState({
        officeName: '',
        phone: '',
        email: '',
        operatingHours: '',
        address: '',
        notes: ''
    });
    const [staffList, setStaffList] = useState([]);
    const [officeMsg, setOfficeMsg] = useState('');
    const [staffMsg, setStaffMsg] = useState('');

    // Modal state for Add/Edit Staff
    const [modalOpen, setModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [staffForm, setStaffForm] = useState({
        name: '',
        role: '',
        phone: '',
        email: '',
        image: '',
        bio: '',
        order: 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [infoRes, staffRes] = await Promise.all([
                axios.get('/api/office-info'),
                axios.get('/api/staff')
            ]);
            if (infoRes.data) {
                setOfficeInfo(infoRes.data);
            }
            if (staffRes.data) {
                setStaffList(staffRes.data);
            }
        } catch (err) {
            console.error('Error loading office & staff data:', err);
        }
    };

    const handleUpdateOfficeInfo = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/office-info', officeInfo, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOfficeInfo(res.data);
            setOfficeMsg('Informasi kantor berhasil diperbarui!');
            setTimeout(() => setOfficeMsg(''), 4000);
        } catch (err) {
            alert('Gagal mengupdate informasi kantor');
        }
    };

    const handleOpenModal = (staff = null) => {
        if (staff) {
            setEditingStaff(staff);
            setStaffForm({
                name: staff.name || '',
                role: staff.role || '',
                phone: staff.phone || '',
                email: staff.email || '',
                image: staff.image || '',
                bio: staff.bio || '',
                order: staff.order || (staffList.length + 1)
            });
        } else {
            setEditingStaff(null);
            setStaffForm({
                name: '',
                role: '',
                phone: '',
                email: '',
                image: '',
                bio: '',
                order: staffList.length + 1
            });
        }
        setModalOpen(true);
    };

    const handleSaveStaff = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (editingStaff) {
                await axios.put(`/api/staff/${editingStaff.id}`, staffForm, { headers });
                setStaffMsg('Data staf berhasil diperbarui!');
            } else {
                await axios.post('/api/staff', staffForm, { headers });
                setStaffMsg('Staf baru berhasil ditambahkan!');
            }
            setModalOpen(false);
            fetchData();
            setTimeout(() => setStaffMsg(''), 4000);
        } catch (err) {
            alert('Gagal menyimpan data staf');
        }
    };

    const handleDeleteStaff = async (id) => {
        if (!window.confirm('Yakin ingin menghapus staf pekerja ini?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/staff/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStaffMsg('Staf pekerja berhasil dihapus');
            fetchData();
            setTimeout(() => setStaffMsg(''), 4000);
        } catch (err) {
            alert('Gagal menghapus staf');
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <Link to="/admin" className="inline-flex items-center gap-2 text-gki-stone hover:text-gki-wood mb-2 text-sm font-semibold">
                        <ArrowLeft size={16} /> Kembali ke Dashboard
                    </Link>
                    <h1 className="text-4xl font-serif text-gki-wood flex items-center gap-3">
                        <Building size={36} className="text-gki-tan" />
                        Kelola Kantor & Staf Pekerja
                    </h1>
                    <p className="text-gki-stone text-base">
                        Atur nomor telepon, Gmail kantor, jam operasional, serta daftar staf pekerja kantor gereja.
                    </p>
                </div>
            </div>

            {/* Section 1: Office Info Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gki-tan/15">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gki-tan/15">
                    <Phone className="text-gki-tan" size={24} />
                    <h2 className="text-2xl font-serif text-gki-wood">Kontak & Informasi Operasional Kantor</h2>
                </div>

                {officeMsg && (
                    <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold">
                        {officeMsg}
                    </div>
                )}

                <form onSubmit={handleUpdateOfficeInfo} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gki-wood mb-1">Nama Kantor / Unit</label>
                        <input
                            type="text"
                            value={officeInfo.officeName || ''}
                            onChange={(e) => setOfficeInfo({ ...officeInfo, officeName: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gki-wood mb-1">
                            Nomor Telepon Kantor & WhatsApp
                        </label>
                        <input
                            type="text"
                            value={officeInfo.phone || ''}
                            onChange={(e) => setOfficeInfo({ ...officeInfo, phone: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                            placeholder="e.g. (0274) 512345 / 0812-3456-7890"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gki-wood mb-1">
                            Email / Gmail Kantor
                        </label>
                        <input
                            type="email"
                            value={officeInfo.email || ''}
                            onChange={(e) => setOfficeInfo({ ...officeInfo, email: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                            placeholder="gkigejayan@gmail.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gki-wood mb-1">
                            Jam Operasional Sekretariat
                        </label>
                        <input
                            type="text"
                            value={officeInfo.operatingHours || ''}
                            onChange={(e) => setOfficeInfo({ ...officeInfo, operatingHours: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                            placeholder="Senin - Sabtu: 08.00 - 16.00 WIB"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gki-wood mb-1">Alamat Lengkap Kantor</label>
                        <textarea
                            rows="2"
                            value={officeInfo.address || ''}
                            onChange={(e) => setOfficeInfo({ ...officeInfo, address: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                            required
                        ></textarea>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gki-wood mb-1">Keterangan Pelayanan Kantor</label>
                        <textarea
                            rows="2"
                            value={officeInfo.notes || ''}
                            onChange={(e) => setOfficeInfo({ ...officeInfo, notes: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                        ></textarea>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-gki-wood text-white px-8 py-3.5 rounded-full font-bold hover:bg-gki-tan transition-all cursor-pointer shadow-lg"
                        >
                            <Save size={18} /> Simpan Informasi Kantor
                        </button>
                    </div>
                </form>
            </div>

            {/* Section 2: Staff Pekerja List */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gki-tan/15">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gki-tan/15">
                    <div className="flex items-center gap-3">
                        <Users className="text-gki-tan" size={24} />
                        <h2 className="text-2xl font-serif text-gki-wood">Daftar Staf Pekerja Kantor</h2>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 bg-gki-tan text-white px-6 py-2.5 rounded-full font-bold hover:bg-gki-wood transition-all cursor-pointer shadow-md text-sm"
                    >
                        <Plus size={18} /> Tambah Staf Pekerja
                    </button>
                </div>

                {staffMsg && (
                    <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold">
                        {staffMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffList.map((staf) => (
                        <div key={staf.id} className="border border-gki-tan/20 p-6 rounded-2xl bg-gki-cream/10 flex flex-col justify-between hover:shadow-lg transition-all">
                            <div>
                                <img
                                    src={staf.image || '/logo polos.PNG'}
                                    alt={staf.name}
                                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 bg-white border border-gki-tan/20 shadow-sm"
                                />
                                <h3 className="text-xl font-serif text-gki-wood text-center mb-1">{staf.name}</h3>
                                <p className="text-gki-tan text-xs font-bold uppercase tracking-wider text-center mb-4">{staf.role}</p>

                                <div className="space-y-2 text-xs text-gki-stone mb-4 border-t border-gki-tan/10 pt-3">
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
                                        <p className="italic text-white/80 line-clamp-2 mt-2">{staf.bio}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gki-tan/15 pt-4">
                                <button
                                    onClick={() => handleOpenModal(staf)}
                                    className="p-2 rounded-lg bg-gki-wood text-white hover:bg-gki-tan transition-all cursor-pointer"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteStaff(staf.id)}
                                    className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {staffList.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gki-stone">
                            Belum ada staf pekerja yang ditambahkan. Klik "Tambah Staf Pekerja" untuk menambahkan.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Add/Edit Staff */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg relative text-gki-wood">
                        <h2 className="text-2xl font-serif mb-6">
                            {editingStaff ? 'Edit Staf Pekerja' : 'Tambah Staf Pekerja Baru'}
                        </h2>

                        <form onSubmit={handleSaveStaff} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gki-wood mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={staffForm.name}
                                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                                    placeholder="e.g. Bpk. Sugeng Santoso"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gki-wood mb-1">Jabatan / Role</label>
                                <input
                                    type="text"
                                    required
                                    value={staffForm.role}
                                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                                    placeholder="e.g. Kepala Kantor Sekretariat"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gki-wood mb-1">Nomor HP / WhatsApp</label>
                                    <input
                                        type="text"
                                        value={staffForm.phone}
                                        onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                                        placeholder="0812-xxxx-xxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gki-wood mb-1">Email / Gmail Staf</label>
                                    <input
                                        type="email"
                                        value={staffForm.email}
                                        onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                                        placeholder="staf@gkigejayan.or.id"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gki-wood mb-1">URL Foto Staf (Opsional)</label>
                                <input
                                    type="text"
                                    value={staffForm.image}
                                    onChange={(e) => setStaffForm({ ...staffForm, image: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                                    placeholder="/logo polos.PNG atau URL Foto"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gki-wood mb-1">Deskripsi / Tugas Singkat</label>
                                <textarea
                                    rows="3"
                                    value={staffForm.bio}
                                    onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
                                    className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-gki-tan text-sm"
                                    placeholder="Tugas & tanggung jawab pelayanan kantor..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-6 py-2.5 rounded-full border border-gray-300 font-semibold text-sm hover:bg-gray-100 transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-full bg-gki-wood text-white font-semibold text-sm hover:bg-gki-tan transition-all cursor-pointer"
                                >
                                    Simpan Staf
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStaff;
