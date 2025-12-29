const multer = require("multer");

const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(
        new Error("Unsupported file type. Only PNG, JPEG, WEBP allowed"),
        false
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
