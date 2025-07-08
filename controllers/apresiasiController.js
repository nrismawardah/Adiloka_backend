const db = require('../config/db');

// Tambah apresiasi
exports.giveApresiasi = (req, res) => {
  const { id_karya } = req.params;
  const { emoji } = req.body;
  const id_user = req.user.id_user;

  // Daftar emoji yang diperbolehkan
  const allowedEmojis = ['👍', '❤️', '👏', '🔥', '💯'];

  // Tolak jika emoji tidak ada dalam daftar
  if (!allowedEmojis.includes(emoji)) {
    return res.status(400).json({
      message: 'Emoji tidak valid. Gunakan salah satu dari: ' + allowedEmojis.join(' ')
    });
  }

  // Cek apakah user sudah memberi apresiasi
  db.query(
    'SELECT * FROM apresiasi WHERE id_user = ? AND id_karya = ?',
    [id_user, id_karya],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal cek data' });
      if (rows.length > 0) {
        return res.status(400).json({ message: 'Kamu sudah memberi apresiasi pada karya ini' });
      }

      // Simpan apresiasi
      db.query(
        'INSERT INTO apresiasi (id_user, id_karya, emoji) VALUES (?, ?, ?)',
        [id_user, id_karya, emoji],
        (err) => {
          if (err) return res.status(500).json({ message: 'Gagal memberi apresiasi' });

          // Cek achievement setelah apresiasi
          cekDanBeriAchievement(id_user);

          res.json({ message: 'Apresiasi berhasil ditambahkan' });
        }
      );
    }
  );
};

// Hapus apresiasi
exports.deleteApresiasi = (req, res) => {
  const { id_karya } = req.params;
  const id_user = req.user.id_user;

  db.query(
    'DELETE FROM apresiasi WHERE id_user = ? AND id_karya = ?',
    [id_user, id_karya],
    (err) => {
      if (err) return res.status(500).json({ message: 'Gagal menghapus apresiasi' });
      res.json({ message: 'Apresiasi dihapus' });
    }
  );
};

// Ambil jumlah apresiasi per karya
exports.getApresiasiByKarya = (req, res) => {
  const { id_karya } = req.params;

  db.query(
    'SELECT COUNT(*) AS total, emoji FROM apresiasi WHERE id_karya = ? GROUP BY emoji',
    [id_karya],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal mengambil apresiasi' });
      res.json(rows);
    }
  );
};
