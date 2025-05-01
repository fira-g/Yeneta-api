import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const maxSize = 3 * 1024 * 1024; //3MB

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: fileFilter,
});

export default upload;
