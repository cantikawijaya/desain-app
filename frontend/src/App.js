import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
    const [pengeluaran, setPengeluaran] = useState([]);
    const [total, setTotal] = useState(0);
    const [deskripsi, setDeskripsi] = useState('');
    const [jumlah, setJumlah] = useState('');

    useEffect(() => {
        getPengeluaran();
    }, []);

    const getPengeluaran = async () => {
        try {
            const response = await axios.get('http://localhost:3004/api/pengeluaran');
            setPengeluaran(response.data.pengeluaran);
            setTotal(response.data.total);
        } catch (error) {
            console.error('Error fetching pengeluaran:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log('Data yang dikirim:', { deskripsi, jumlah }); // Sudah ada
    
        // Pastikan bahwa jumlah adalah number
        const parsedJumlah = parseFloat(jumlah);
        if (isNaN(parsedJumlah) || !deskripsi) {
            console.error('Deskripsi dan jumlah harus diisi dan jumlah harus angka.');
            return; // Mencegah pengiriman jika ada input yang tidak valid
        }
    
        try {
            await axios.post('http://localhost:3004/api/pengeluaran', {
                deskripsi,
                jumlah: parsedJumlah, // Kirim jumlah sebagai angka
            });
    
            // Reset form setelah data berhasil dikirim
            setDeskripsi('');
            setJumlah('');
            // Refresh data pengeluaran
            getPengeluaran();
        } catch (error) {
            console.error('Error adding pengeluaran:', error.response ? error.response.data : error.message);
        }
    };     

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3004/api/pengeluaran/${id}`);
            getPengeluaran(); // Refresh data pengeluaran setelah dihapus
        } catch (error) {
            console.error('Error deleting pengeluaran:', error);
        }
    };

    return (
        <div className="container">
            <h1>Pengeluaran Bulanan</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Deskripsi"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Jumlah"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    required
                />
                <button type="submit">Tambah Pengeluaran</button>
            </form>

            <h2>Daftar Pengeluaran</h2>
            {pengeluaran.length > 0 ? (
                <div className="pengeluaran-grid">
                    <div className="pengeluaran-header">
                        <div>Deskripsi</div>
                        <div>Jumlah</div>
                        <div>Aksi</div>
                    </div>
                    {pengeluaran.map((item) => (
                        <div key={item.id} className="pengeluaran-item">
                            <span>{item.deskripsi}</span>
                            <span>Rp. {item.jumlah}</span>
                            <button onClick={() => handleDelete(item.id)} className="delete-btn">Hapus</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Tidak ada pengeluaran.</p>
            )}

            <h3>Total Pengeluaran: Rp. {total}</h3>
        </div>
    );
}

export default App;
