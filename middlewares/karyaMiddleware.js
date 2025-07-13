const multer = require('multer');

// simpan file ke dalam memori (untuk disimpan ke database langsung)
const storage = multer.memoryStorage();

const karyaUpload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // tetap batasi ukuran
  // Hapus fileFilter agar semua mime type diterima
});


module.exports = karyaUpload;