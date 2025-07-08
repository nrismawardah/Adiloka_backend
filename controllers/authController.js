const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { nama, email, password, role } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)', 
    [nama, email, hashed, role || 'user'], (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal mendaftar', error: err });
      res.json({ message: 'Registrasi berhasil' });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
    if (err || rows.length === 0) return res.status(401).json({ message: 'Email tidak ditemukan' });

    const user = rows[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id_user: user.id_user, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user: { id_user: user.id_user, nama: user.nama, role: user.role } });
  });
};
