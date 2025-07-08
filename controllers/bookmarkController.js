const db = require('../config/db');

// Tambah bookmark
exports.addBookmark = (req, res) => {
  const id_user = req.user.id_user;
  const { id_karya } = req.params;

  // Cek apakah sudah dibookmark
  db.query('SELECT * FROM bookmark WHERE id_user = ? AND id_karya = ?', [id_user, id_karya], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal cek bookmark' });
    if (rows.length > 0) return res.status(400).json({ message: 'Karya sudah dibookmark' });

    db.query('INSERT INTO bookmark (id_user, id_karya) VALUES (?, ?)', [id_user, id_karya], (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menambahkan bookmark' });
      res.json({ message: 'Bookmark berhasil ditambahkan' });
    });
  });
};

// Hapus bookmark
exports.removeBookmark = (req, res) => {
  const id_user = req.user.id_user;
  const { id_karya } = req.params;

  db.query('DELETE FROM bookmark WHERE id_user = ? AND id_karya = ?', [id_user, id_karya], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus bookmark' });
    res.json({ message: 'Bookmark berhasil dihapus' });
  });
};

// Lihat semua bookmark milik user
exports.getBookmarks = (req, res) => {
  const id_user = req.user.id_user;

  const query = `
    SELECT k.id_karya, k.judul, k.deskripsi, k.mime_type, k.tanggal_upload, u.nama AS nama_pengunggah
    FROM bookmark b
    JOIN karya k ON b.id_karya = k.id_karya
    JOIN users u ON k.id_user = u.id_user
    WHERE b.id_user = ?
    ORDER BY b.tanggal_disimpan DESC
  `;

  db.query(query, [id_user], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil bookmark' });
    res.json(rows);
  });
};
