const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const mime = require("mime");

const storage = require("../lib/firebase-lib").storage();

const bucket = storage.bucket("oztenant-api.appspot.com");

const generateFileName = file => {
  return new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          raw.toString("hex") +
            Date.now() +
            "." +
            mime.getExtension(file.mimetype)
        );
      }
    });
  });
};

function fileUpload(req, res) {
  try {
    console.log("fileupload");
    const image = req.files.file[0];
    generateFileName(image).then(name => {
      const tmpPath = path.join(os.tmpdir(), name);
      fs.outputFile(tmpPath, image.buffer).then(() => {
        bucket.upload(tmpPath).then(() => fs.remove(tmpPath));
        res.status(200).json({ message: "Success", filename: name });
      });
    });
  } catch (e) {
    console.error("e", e);
    res.status(500).send({ message: "Internal Error" });
  }
}

module.exports = fileUpload;
