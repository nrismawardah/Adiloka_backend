const db = require('../config/db');
const { cekDanBeriAchievement } = require('../utils/achievementChecker');

// Upload karya
exports.uploadKarya = (req, res) => {
  console.log('✅ Masuk uploadKarya');
  console.log('🔐 req.user:', req.user);
  console.log('📝 req.body:', req.body);
  console.log('📸 req.file:', req.file);

  const { judul, deskripsi, kategori_id, daerah_id, lokasi } = req.body;
  const user = req.user;

  if (!req.file) {
    return res.status(400).json({ message: 'File gambar wajib diunggah' });
  }

  const file = req.file;
  const query = `
    INSERT INTO karya (judul, deskripsi, foto, mime_type, ekstensi, ukuran_file, kategori_id, daerah_id, lokasi, status, id_user)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu', ?)
  `;

  db.query(query, [
    judul,
    deskripsi,
    file.buffer,
    file.mimetype,
    file.originalname.split('.').pop(),
    file.size,
    kategori_id,
    daerah_id,
    lokasi,
    user.id_user
  ], (err, result) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ message: 'Gagal unggah karya', error: err });
    }

    res.json({ message: 'Karya berhasil diunggah dan menunggu persetujuan' });

    // Cek achievement setelah upload
    cekDanBeriAchievement(user.id_user);
  });
};

// Lihat semua karya (beranda)
exports.getAllKarya = (req, res) => {
  const query = `
    SELECT 
      k.id_karya,
      k.judul,
      k.deskripsi,
      k.mime_type,
      k.id_user,
      u.nama,
      k.status,
      k.kategori_id,
      kat.nama_kategori AS kategori,
      k.daerah_id,
      d.nama_daerah AS daerah,
      k.lokasi
    FROM karya k
    JOIN users u ON k.id_user = u.id_user
    JOIN kategori kat ON k.kategori_id = kat.id_kategori
    JOIN daerah d ON k.daerah_id = d.id_daerah
    WHERE k.status = 'disetujui'
    ORDER BY k.tanggal_upload DESC
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data', error: err });
    res.json(rows);
  });
};

// Lihat karya detail (dengan foto)
exports.getKaryaById = (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM karya WHERE id_karya = ?', [id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ message: 'Karya tidak ditemukan' });

    const karya = rows[0];
    res.setHeader('Content-Type', karya.mime_type);
    res.send(karya.foto);
  });
};

// Edit karya (hanya untuk pemilik)
exports.editKarya = (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, kategori_id, daerah_id, lokasi } = req.body;
  const user = req.user;

  // Validasi kepemilikan karya
  db.query('SELECT * FROM karya WHERE id_karya = ?', [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: 'Karya tidak ditemukan' });
    }

    const karya = rows[0];
    if (karya.id_user !== user.id_user) {
      return res.status(403).json({ message: 'Kamu tidak diizinkan mengedit karya ini' });
    }

    // Update karya
    const query = `
      UPDATE karya SET judul = ?, deskripsi = ?, kategori_id = ?, daerah_id = ?, lokasi = ?, status = 'menunggu', alasan_penolakan = NULL
      WHERE id_karya = ?
    `;
    db.query(query, [judul, deskripsi, kategori_id, daerah_id, lokasi, id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal mengedit karya' });
      res.json({ message: 'Karya berhasil diperbarui dan akan direview ulang' });
    });
  });
};

// Tambahan: Get karya milik user (profil)
exports.getKaryaByUser = (req, res) => {
  const id_user = req.user.id_user;
  db.query(
    'SELECT * FROM karya WHERE id_user = ? ORDER BY tanggal_upload DESC',
    [id_user],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'Gagal ambil data karya' });
      res.json(rows);
    }
  );
};

// Hapus karya (hanya untuk pemilik)
exports.deleteKarya = (req, res) => {
  const { id } = req.params;
  const user = req.user;

  db.query('SELECT * FROM karya WHERE id_karya = ?', [id], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).json({ message: 'Karya tidak ditemukan' });
    }

    const karya = rows[0];
    if (user.role !== 'admin' && karya.id_user !== user.id_user) {
      return res.status(403).json({ message: 'Hanya pemilik atau admin yang boleh menghapus karya ini' });
    }

    db.query('DELETE FROM karya WHERE id_karya = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal menghapus karya' });
      res.json({ message: 'Karya berhasil dihapus' });
    });
  });
};

// Admin menyetujui / menolak karya
exports.updateStatusKarya = (req, res) => {
  const { status, alasan } = req.body;
  const { id } = req.params;
  const user = req.user;

  if (user.role !== 'admin') return res.status(403).json({ message: 'Hanya admin yang bisa memoderasi' });

  db.query('SELECT * FROM karya WHERE id_karya = ?', [id], (err, rows) => {
    if (err || rows.length === 0) return res.status(404).json({ message: 'Karya tidak ditemukan' });

    const karya = rows[0];

    db.query(
      'UPDATE karya SET status = ?, alasan_penolakan = ? WHERE id_karya = ?',
      [status, alasan || null, id],
      (err) => {
        if (err) return res.status(500).json({ message: 'Gagal mengubah status karya' });

        // 🔔 Kirim notifikasi ke pemilik karya
        let pesan = '';
        if (status === 'disetujui') {
          pesan = `Karyamu "${karya.judul}" telah disetujui oleh admin.`;
        } else if (status === 'ditolak') {
          pesan = `Karyamu "${karya.judul}" ditolak. Alasan: ${alasan || '-'}`;
        }

        db.query(
          'INSERT INTO notifikasi (id_user, isi_pesan) VALUES (?, ?)',
          [karya.id_user, pesan],
          (err) => {
            if (err) console.error('Gagal kirim notifikasi:', err);
            res.json({ message: 'Status karya diperbarui dan notifikasi dikirim' });
          }
        );
      }
    );
  });
};

exports.getKaryaDetailById = (req, res) => {
  const { id } = req.params;

  const karyaQuery = `
    SELECT 
      k.id_karya,
      k.judul,
      k.deskripsi,
      k.tanggal_upload,
      k.mime_type,
      u.id_user,
      u.nama,
      k.kategori_id,
      kat.nama_kategori AS kategori,
      k.daerah_id,
      d.nama_daerah AS daerah,
      k.lokasi
    FROM karya k
    JOIN users u ON k.id_user = u.id_user
    JOIN kategori kat ON k.kategori_id = kat.id_kategori
    JOIN daerah d ON k.daerah_id = d.id_daerah
    WHERE k.id_karya = ?
  `;

  const apresiasiQuery = `
    SELECT emoji, COUNT(*) AS total
    FROM apresiasi
    WHERE id_karya = ?
    GROUP BY emoji
  `;

  db.query(karyaQuery, [id], (err, karyaRows) => {
    if (err || karyaRows.length === 0) {
      return res.status(404).json({ message: 'Karya tidak ditemukan' });
    }

    const karya = karyaRows[0];

    db.query(apresiasiQuery, [id], (err2, apresiasiRows) => {
      if (err2) return res.status(500).json({ message: 'Gagal ambil data apresiasi' });

      const apresiasi = {};
      apresiasiRows.forEach(row => {
        apresiasi[row.emoji] = row.total;
      });

      res.json({ ...karya, apresiasi });
    });
  });
};


// Filter karya berdasarkan kategori dan daerah
exports.getKaryaFiltered = (req, res) => {
  const { kategori_id, daerah_id } = req.query;

  let query = `
    SELECT k.id_karya, k.judul, k.deskripsi, k.mime_type, u.nama, k.status,
           k.kategori_id, k.daerah_id, k.lokasi
    FROM karya k
    JOIN users u ON k.id_user = u.id_user
    WHERE k.status = 'disetujui'
  `;
  const params = [];

  if (kategori_id) {
    query += ' AND k.kategori_id = ?';
    params.push(kategori_id);
  }

  if (daerah_id) {
    query += ' AND k.daerah_id = ?';
    params.push(daerah_id);
  }

  query += ' ORDER BY k.tanggal_upload DESC';

  db.query(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data karya', error: err });
    res.json(rows);
  });
};

// 🔍 Search karya berdasarkan judul atau deskripsi
exports.searchKarya = (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query pencarian wajib diisi' });
  }

  const sql = `
    SELECT 
      k.id_karya,
      k.judul,
      k.deskripsi,
      k.mime_type,
      u.nama,
      k.status,
      k.kategori_id,
      kat.nama_kategori AS kategori,
      k.daerah_id,
      d.nama_daerah AS daerah,
      k.lokasi
    FROM karya k
    JOIN users u ON k.id_user = u.id_user
    JOIN kategori kat ON k.kategori_id = kat.id_kategori
    JOIN daerah d ON k.daerah_id = d.id_daerah
    WHERE k.status = 'disetujui'
      AND (k.judul LIKE ? OR k.deskripsi LIKE ?)
    ORDER BY k.tanggal_upload DESC
  `;

  const likeQuery = `%${query}%`;
  db.query(sql, [likeQuery, likeQuery], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal melakukan pencarian', error: err });
    }

    res.json(rows);
  });
};
