const express = require('express');
const router = express.Router();
const karyaController = require('../controllers/karyaController');
const verifyToken = require('../middlewares/authMiddleware');
const karyaUpload = require('../middlewares/karyaMiddleware');

// Upload karya
router.post('/', verifyToken, karyaUpload.single('foto'), karyaController.uploadKarya);

// Lihat karya berdasarkan kategori & daerah
router.get('/filter', karyaController.getKaryaFiltered);

// Detail karya lengkap (tanpa foto)
router.get('/detail/:id', karyaController.getKaryaDetailById);

// Lihat semua karya disetujui
router.get('/', karyaController.getAllKarya);

// Pencarian karya
router.get('/search', karyaController.searchKarya);


// Ambil 1 karya (gambarnya)
router.get('/:id', karyaController.getKaryaById);

// Edit karya
router.put('/:id', verifyToken, karyaController.editKarya);

// Delete karya
router.delete('/:id', verifyToken, karyaController.deleteKarya);

// Admin setujui/tolak karya
router.put('/:id/status', verifyToken, karyaController.updateStatusKarya);


module.exports = router;