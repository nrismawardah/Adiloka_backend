const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategoriController');
const verifyToken = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

router.get('/', kategoriController.getAllKategori);
router.post('/', verifyToken, adminOnly, kategoriController.createKategori);
router.put('/:id', verifyToken, adminOnly, kategoriController.updateKategori);
router.delete('/:id', verifyToken, adminOnly, kategoriController.deleteKategori);

module.exports = router;
