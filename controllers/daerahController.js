const db = require('../config/db');

exports.getAllDaerah = (req, res) => {
  db.query('SELECT * FROM daerah', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil data' });
    res.json(rows);
  });
};


exports.createDaerah = (req, res) => {
  const { nama_daerah } = req.body;
  db.query('INSERT INTO daerah (nama_daerah) VALUES (?)', [nama_daerah], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menambahkan' });
    res.json({ message: 'Daerah ditambahkan' });
  });
};

exports.updateDaerah = (req, res) => {
  const { id } = req.params;
  const { nama_daerah } = req.body;
  db.query('UPDATE daerah SET nama_daerah = ? WHERE id_daerah = ?', [nama_daerah, id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal mengedit' });
    res.json({ message: 'Daerah diperbarui' });
  });
};

exports.deleteDaerah = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM daerah WHERE id_daerah = ?', [id], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal menghapus' });
    res.json({ message: 'Daerah dihapus' });
  });
};
