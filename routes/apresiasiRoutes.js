const express = require('express');
const router = express.Router();
const apresiasiController = require('../controllers/apresiasiController');
const verifyToken = require('../middlewares/authMiddleware');

// Beri apresiasi
router.post('/:id_karya', verifyToken, apresiasiController.giveApresiasi);

// Hapus apresiasi
router.delete('/:id_karya', verifyToken, apresiasiController.deleteApresiasi);

// Ambil jumlah apresiasi
router.get('/:id_karya', apresiasiController.getApresiasiByKarya);

// Cek apakah user sudah memberi apresiasi pada karya tertentu
router.get('/check/:id_karya', verifyToken, apresiasiController.getUserApresiasi);

module.exports = router;
