const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const verifyToken = require('../middlewares/authMiddleware');

// Tambah bookmark
router.post('/:id_karya', verifyToken, bookmarkController.addBookmark);

// Hapus bookmark
router.delete('/:id_karya', verifyToken, bookmarkController.removeBookmark);

// Lihat semua bookmark user
router.get('/', verifyToken, bookmarkController.getBookmarks);

module.exports = router;
