import fileType from "file-type";
import "dotenv/config";
import fs from "fs";
import { ResponseError } from "../helpers/response-error.helper.js";

const processingImageMiddleware = async (req, res, next) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const type = await fileType.fromBuffer(buffer); // mendapatkan type mime berdasarkan magic number nya

    if (type.mime === "image/jpeg" || type.mime === "image/png") {
      const protocol = process.env.APP_PROTOCOL;
      const host = process.env.APP_HOST;
      const port = process.env.APP_PORT;

      const path = `${protocol}://${host}:${port}/users/photo-profiles/${req.file.filename}`;
      req.body.photoProfile = path;
      next();
    } else {
      throw new ResponseError(400, "the file is not in jpeg or png format");
    }
  } catch (error) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(error.status || 500).json({ error: error.message });
  }
};

export default processingImageMiddleware;
