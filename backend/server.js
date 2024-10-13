const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(bodyParser.json());

// Konfigurasi koneksi ke database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pengeluaran_db' 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint untuk menambah pengeluaran
app.post('/api/pengeluaran', (req, res) => {
    const { deskripsi, jumlah } = req.body;

    // Log data yang diterima
    console.log('Data diterima:', { deskripsi, jumlah });

    // Validasi input
    if (!deskripsi || !jumlah) {
        console.error('Deskripsi atau jumlah tidak boleh kosong');
        return res.status(400).json({ error: 'Deskripsi dan jumlah tidak boleh kosong.' });
    }

    // Query untuk menambahkan data ke database 
    const sql = 'INSERT INTO pengeluaran (deskripsi, jumlah) VALUES (?, ?)';

    db.query(sql, [deskripsi, jumlah], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err); // Log jika ada error
            return res.status(500).json({ error: 'Error inserting data: ' + err.message });
        }        
        res.status(201).json({ message: 'Pengeluaran ditambahkan!', id: result.insertId });
    });
});

// Endpoint untuk mendapatkan semua pengeluaran dan total
app.get('/api/pengeluaran', (req, res) => {
    const sql = 'SELECT * FROM pengeluaran';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Hitung total pengeluaran
        const total = results.reduce((sum, item) => sum + item.jumlah, 0);

        // Log untuk memastikan data yang dikirim dari server
        console.log('Pengeluaran fetched:', results);
        console.log('Total pengeluaran:', total);

        // Kirim data pengeluaran dan total
        res.status(200).json({ pengeluaran: results, total });
    });
});

// Endpoint untuk menghapus pengeluaran
app.delete('/api/pengeluaran/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM pengeluaran WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting pengeluaran:', err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pengeluaran tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Pengeluaran berhasil dihapus.' });
    });
});

// Mulai server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
