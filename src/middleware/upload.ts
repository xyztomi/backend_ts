import multer from "multer";
import path from "path";
// setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./public/images"));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    // replace whitespace with -
    const sanitizedFileName = file.originalname.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${sanitizedFileName}`;
    cb(null, fileName);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: (req, file, cb: any) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("woii"), false);
    }
  },
});
