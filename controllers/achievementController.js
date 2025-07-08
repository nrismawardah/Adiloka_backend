const db = require('../config/db');

exports.getUserAchievements = (req, res) => {
  const id_user = req.user.id_user;

  const query = `
    SELECT a.nama, a.deskripsi, au.tanggal_dicapai
    FROM achievement_user au
    JOIN achievement a ON au.id_achievement = a.id_achievement
    WHERE au.id_user = ?
  `;

  db.query(query, [id_user], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal mengambil data achievement' });
    res.json(rows);
  });
};
