const db = require('../config/db');

exports.cekDanBeriAchievement = (id_user) => {
  // Cek apakah user sudah punya achievement tertentu

  // 1. Top Contributor: upload ≥ 10 karya
  db.query('SELECT COUNT(*) AS total FROM karya WHERE id_user = ?', [id_user], (err, rows) => {
    if (err) return;
    const total = rows[0].total;
    if (total >= 10) {
      // Masukkan achievement jika belum dimiliki
      db.query(
        'INSERT IGNORE INTO achievement_user (id_user, id_achievement, tanggal_dicapai) VALUES (?, 1, CURDATE())',
        [id_user]
      );
    }
  });

  // 2. Eksploratif: apresiasi ≥ 30 karya berbeda
  db.query('SELECT COUNT(DISTINCT id_karya) AS total FROM apresiasi WHERE id_user = ?', [id_user], (err, rows) => {
    if (err) return;
    const total = rows[0].total;
    if (total >= 30) {
      db.query(
        'INSERT IGNORE INTO achievement_user (id_user, id_achievement, tanggal_dicapai) VALUES (?, 3, CURDATE())',
        [id_user]
      );
    }
  });

  // 3. Populer: karya user mana pun mendapat ≥ 100 apresiasi
  db.query(`
    SELECT id_karya FROM karya WHERE id_user = ?
  `, [id_user], (err, rows) => {
    if (err || rows.length === 0) return;
    const karyaIds = rows.map(r => r.id_karya);
    if (karyaIds.length === 0) return;

    db.query(`
      SELECT COUNT(*) AS total FROM apresiasi WHERE id_karya IN (?)
    `, [karyaIds], (err, rows) => {
      if (err) return;
      const total = rows[0].total;
      if (total >= 100) {
        db.query(
          'INSERT IGNORE INTO achievement_user (id_user, id_achievement, tanggal_dicapai) VALUES (?, 2, CURDATE())',
          [id_user]
        );
      }
    });
  });
};
