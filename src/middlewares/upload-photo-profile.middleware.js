import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, process.cwd() + "/public/users/photo-profiles");
  },

  filename(req, file, callback) {
    const encodeName = file.originalname.replace(/[ %?#&=]/g, "-");
    callback(null, Date.now() + "-" + encodeName);
  },
});

const uploadPhotoProfile = multer({
  storage: storage,
  limits: {
    fieldSize: 1 * 1024 * 1024, // max 1 mb
  },
});

export default uploadPhotoProfile;
