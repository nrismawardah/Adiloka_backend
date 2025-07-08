const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const achievementController = require('../controllers/achievementController');

router.get('/', verifyToken, achievementController.getUserAchievements);

module.exports = router;
