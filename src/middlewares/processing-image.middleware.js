import "dotenv/config";
import fs from "fs";
import { fileHelper } from "../helpers/file.helper.js";

const processingImageMiddleware = async (req, res, next) => {
  try {
    const path = await fileHelper.verifyImageWithMagicNumber(req.file);

    req.body.photoProfile = path;
    next();
  } catch (error) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(error.status || 500).json({ error: error.message });
  }
};

export default processingImageMiddleware;
