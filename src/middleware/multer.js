const multer = require("multer");

const allowedMimeTypes = [
  // Images
  "image/png",
  "image/jpeg",
  "image/webp",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
];

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB (WhatsApp max)
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type for WhatsApp"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
