const multer = require("multer");
const path = require("path");

exports.uploadBookImageMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(__dirname, "../uploads/books");
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const fileName = `book-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
});

exports.uploadBookImageController = async (req, res, next) => {
  if (req.file)
    res.status(201).json({
      ok: true,
      code: 201,
      message: "image uploaded successfully",
      filename: req.file.filename,
    });
  else
    res.status(400).json({
      ok: false,
      code: 400,
      message: "No image uploaded",
    });
};
