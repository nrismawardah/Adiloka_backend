const db = require('../config/db');

exports.getAllKategori = (req, res) => {
  db.query('SELECT * FROM kategori', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data' });
    res.json(rows);
  });
};


exports.createKategori = (req, res) => {
  const { nama_kategori } = req.body;
  db.query('INSERT INTO kategori (nama_kategori) VALUES (?)', [nama_kategori], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menambahkan' });
    res.json({ message: 'Kategori ditambahkan' });
  });
};

exports.updateKategori = (req, res) => {
  const { id } = req.params;
  const { nama_kategori } = req.body;
  db.query('UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?', [nama_kategori, id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal mengedit' });
    res.json({ message: 'Kategori diperbarui' });
  });
};

exports.deleteKategori = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM kategori WHERE id_kategori = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus' });
    res.json({ message: 'Kategori dihapus' });
  });
};
