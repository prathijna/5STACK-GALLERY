const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}-${file.originalname}`);
  },
});
module.exports = store = multer({ storage: storage });
