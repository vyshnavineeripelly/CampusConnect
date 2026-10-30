const multer = require("multer");

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (file.mimetype !== "application/pdf") {
    return callback(
      new Error("Only PDF files are allowed"),
      false
    );
  }

  callback(null, true);
};

const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const uploadSinglePDF = (req, res, next) => {
  uploadPDF.single("file")(req, res, (error) => {
    if (!error) return next();

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "PDF file size must be 10 MB or less",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Invalid PDF upload",
    });
  });
};

module.exports = {
  uploadPDF,
  uploadSinglePDF,
  MAX_FILE_SIZE,
};
