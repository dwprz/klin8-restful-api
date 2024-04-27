import fs from "fs";

const deleteFile = (url) => {
  const mainFolder = url.split("/")[3];
  const subFolder = url.split("/")[4];
  const fileName = url.split("/")[5];

  const path = process.cwd() + `/public/${mainFolder}/${subFolder}/${fileName}`;
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export default deleteFile;
