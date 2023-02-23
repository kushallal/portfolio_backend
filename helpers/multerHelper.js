const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./PostImages");
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});
const singleImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    req.isValid = true;
    if (
      extension !== ".png" &&
      extension !== ".jpg" &&
      extension !== ".gif" &&
      extension !== ".jpeg"
    ) {
      req.isValid = false;
      cb(null, false);
    }
    cb(null, true);
  },
}).single("image");

module.exports = singleImage;
