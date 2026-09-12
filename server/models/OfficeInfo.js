const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OfficeInfo = sequelize.define('OfficeInfo', {
    officeName: {
        type: DataTypes.STRING,
        defaultValue: 'Sekretariat Kantor GKI Gejayan',
    },
    address: {
        type: DataTypes.TEXT,
        defaultValue: 'Jl. Affandi Gg. Jemb. Merah No.84D, Soropadan, Condongcatur, Kec. Depok, Kabupaten Sleman, DIY 55283',
    },
    phone: {
        type: DataTypes.STRING,
        defaultValue: '(0274) 512345 / WhatsApp: 0812-3456-7890',
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: 'gkigejayan@gmail.com',
    },
    operatingHours: {
        type: DataTypes.STRING,
        defaultValue: 'Senin - Sabtu: 08.00 - 16.00 WIB',
    },
    notes: {
        type: DataTypes.TEXT,
        defaultValue: 'Melayani pelayanan surat keterangan jemaat, pendaftaran baptis/sidi, pernikahan, serta informasi pelayanan kantor.',
    },
});

module.exports = OfficeInfo;
