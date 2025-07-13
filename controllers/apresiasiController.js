const db = require('../config/db');

exports.giveApresiasi = (req, res) => {
  const { id_karya } = req.params;
  const { emoji } = req.body;
  const id_user = req.user.id_user;

  const allowedEmojis = ['👍', '❤️'];
  if (!allowedEmojis.includes(emoji)) {
    return res.status(400).json({
      message: 'Emoji tidak valid. Gunakan salah satu dari: ' + allowedEmojis.join(' ')
    });
  }

  // Hapus apresiasi sebelumnya (jika ada), agar hanya satu emoji per karya per user
  db.query(
    'DELETE FROM apresiasi WHERE id_user = ? AND id_karya = ?',
    [id_user, id_karya],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menghapus apresiasi lama' });

      // Simpan apresiasi baru
      db.query(
        'INSERT INTO apresiasi (id_user, id_karya, emoji) VALUES (?, ?, ?)',
        [id_user, id_karya, emoji],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Gagal memberi apresiasi' });

          res.json({ message: 'Apresiasi berhasil ditambahkan' });
        }
      );
    }
  );
};


// Hapus apresiasi berdasarkan emoji
exports.deleteApresiasi = (req, res) => {
  const { id_karya } = req.params;
  const { emoji } = req.body;
  const id_user = req.user.id_user;

  if (!emoji) {
    return res.status(400).json({ message: 'Emoji diperlukan untuk menghapus apresiasi' });
  }

  db.query(
    'DELETE FROM apresiasi WHERE id_user = ? AND id_karya = ? AND emoji = ?',
    [id_user, id_karya, emoji],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal menghapus apresiasi' });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Apresiasi tidak ditemukan' });
      }
      res.json({ message: 'Apresiasi dihapus' });
    }
  );
};


// Ambil jumlah apresiasi per karya (group by emoji)
exports.getApresiasiByKarya = (req, res) => {
  const { id_karya } = req.params;

  db.query(
    'SELECT emoji, COUNT(*) AS total FROM apresiasi WHERE id_karya = ? GROUP BY emoji',
    [id_karya],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil apresiasi' });

      res.json(rows);
    }
  );
};


// Ambil emoji yang diberikan user pada karya
exports.getUserApresiasi = (req, res) => {
  const { id_karya } = req.params;
  const id_user = req.user.id_user;

  db.query(
    'SELECT emoji FROM apresiasi WHERE id_user = ? AND id_karya = ?',
    [id_user, id_karya],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal ambil data apresiasi user' });
      res.json(rows.map(r => r.emoji)); // array dengan max 1 item
    }
  );
};
