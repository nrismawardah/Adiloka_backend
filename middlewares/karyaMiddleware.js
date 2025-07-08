const multer = require('multer');

// simpan file ke dalam memori (untuk disimpan ke database langsung)
const storage = multer.memoryStorage();

const karyaUpload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung'), false);
    }
  }
});

module.exports = karyaUpload;