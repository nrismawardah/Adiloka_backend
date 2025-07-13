const db = require('../config/db');

// Ambil profil user
exports.getProfile = (req, res) => {
  const id_user = req.user.id_user;

  db.query('SELECT id_user, nama, email, avatar FROM users WHERE id_user = ?', [id_user], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const user = rows[0];
    res.json(user);
  });
};

// Edit profil user
exports.updateProfile = (req, res) => {
  const id_user = req.user.id_user;
  const { nama, email } = req.body;
  const avatar = req.file?.buffer;

  const query = avatar
    ? 'UPDATE users SET nama = ?, email = ?, avatar = ? WHERE id_user = ?'
    : 'UPDATE users SET nama = ?, email = ? WHERE id_user = ?';

  const params = avatar
    ? [nama, email, avatar, id_user]
    : [nama, email, id_user];

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal update profil', error: err });

    res.json({ message: 'Profil berhasil diperbarui' });
  });
};

// Ambil statistik user
exports.getUserStatistik = (req, res) => {
  const id_user = req.user.id_user;

  const queryKarya = `
    SELECT COUNT(*) AS total_karya_disetujui
    FROM karya
    WHERE id_user = ? AND status = 'disetujui'
  `;

  const queryApresiasi = `
    SELECT COUNT(*) AS total_apresiasi
    FROM apresiasi
    WHERE id_karya IN (
      SELECT id_karya FROM karya WHERE id_user = ?
    )
  `;

  db.query(queryKarya, [id_user], (err, karyaRows) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data karya' });

    db.query(queryApresiasi, [id_user], (err2, apresiasiRows) => {
      if (err2) return res.status(500).json({ message: 'Gagal ambil data apresiasi' });

      res.json({
        total_karya_disetujui: karyaRows[0].total_karya_disetujui,
        total_apresiasi: apresiasiRows[0].total_apresiasi,
      });
    });
  });
};
