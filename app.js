const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve images

// Routes
const authRoutes = require('./routes/authRoutes');
const karyaRoutes = require('./routes/karyaRoutes');
const kategoriRoutes = require('./routes/kategoriRoutes');
const daerahRoutes = require('./routes/daerahRoutes');
const apresiasiRoutes = require('./routes/apresiasiRoutes');
//const bookmarkRoutes = require('./routes/bookmarkRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
//const notifikasiRoutes = require('./routes/notifikasiRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/karya', karyaRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/daerah', daerahRoutes);
app.use('/api/apresiasi', apresiasiRoutes);
//app.use('/api/bookmark', bookmarkRoutes);
app.use('/api/achievement', achievementRoutes);
//app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/user', userRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
