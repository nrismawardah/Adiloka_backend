const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, notifikasiController.getUserNotifikasi);
router.put('/read', verifyToken, notifikasiController.markAllRead);

module.exports = router;
