const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');
const avatarUpload = require('../middlewares/avatarUpload');

// Ambil profil user
router.get('/profile', verifyToken, userController.getProfile);

// Update profil user
router.put('/profile', verifyToken, avatarUpload.single('avatar'), userController.updateProfile);

// Statistik user (total karya disetujui & apresiasi)
router.get('/statistik', verifyToken, userController.getUserStatistik);

module.exports = router;
