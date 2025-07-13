const multer = require('multer');
const storage = multer.memoryStorage();

const avatarUpload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 } // maksimal 1MB
});

module.exports = avatarUpload;
