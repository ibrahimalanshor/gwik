const path = require('path');
const { unlink } = require('node:fs/promises');
const multer = require('multer');
const { BadRequestException } = require('../../exceptions');

function createStorage({ field, allowedTypes, getPath, getFilename }) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, getPath ? getPath({ req, file }) : 'upload');
    },
    filename: function (req, file, cb) {
      cb(null, getFilename ? getFilename({ req, file }) : file.filename);
    },
  });

  async function fileFilter(req, file, cb) {
    try {
      if (
        !allowedTypes
          .map((type) => `.${type}`)
          .includes(path.extname(file.originalname))
      ) {
        await unlink(file, path);

        throw null;
      }

      cb(null, true);
    } catch (err) {
      cb(new BadRequestException());
    }
  }

  return multer({ storage, fileFilter }).single(field);
}

module.exports = { createStorage };
