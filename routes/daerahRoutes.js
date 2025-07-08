const express = require('express');
const router = express.Router();
const daerahController = require('../controllers/daerahController');
const verifyToken = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminOnly');

router.get('/', daerahController.getAllDaerah);
router.post('/', verifyToken, adminOnly, daerahController.createDaerah);
router.put('/:id', verifyToken, adminOnly, daerahController.updateDaerah);
router.delete('/:id', verifyToken, adminOnly, daerahController.deleteDaerah);

module.exports = router;
