import { ResponseError } from "./error.helper.js";
import fileType from "file-type";
import fs from "fs";
import "dotenv/config";

const deleteFile = (url) => {
  const mainFolder = url.split("/")[3];
  const subFolder = url.split("/")[4];
  const fileName = url.split("/")[5];

  const path = process.cwd() + `/public/${mainFolder}/${subFolder}/${fileName}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const verifyImageWithMagicNumber = async (file) => {
  const buffer = fs.readFileSync(file.path);
  const type = await fileType.fromBuffer(buffer); // mendapatkan type mime berdasarkan magic number nya

  if (type.mime === "image/jpeg" || type.mime === "image/png") {
    const protocol = process.env.APP_PROTOCOL;
    const host = process.env.APP_HOST;
    const port = process.env.APP_PORT;

    const path = `${protocol}://${host}:${port}/users/photo-profiles/${file.filename}`;
    return path;
  } else {
    throw new ResponseError(400, "the file is not in jpeg or png format");
  }
};

export const fileHelper = {
  deleteFile,
  verifyImageWithMagicNumber,
};
