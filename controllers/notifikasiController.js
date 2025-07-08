const db = require('../config/db');

// Ambil semua notifikasi milik user
exports.getUserNotifikasi = (req, res) => {
  const id_user = req.user.id_user;

  db.query(
    'SELECT * FROM notifikasi WHERE id_user = ? ORDER BY tanggal DESC',
    [id_user],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal ambil notifikasi' });
      res.json(rows);
    }
  );
};

// Tandai semua notifikasi sebagai dibaca
exports.markAllRead = (req, res) => {
  const id_user = req.user.id_user;

  db.query(
    'UPDATE notifikasi SET status_baca = TRUE WHERE id_user = ?',
    [id_user],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal update status notifikasi' });
      res.json({ message: 'Semua notifikasi ditandai sebagai dibaca' });
    }
  );
};
