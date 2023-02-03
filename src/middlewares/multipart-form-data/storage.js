const path = require('path');
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

  function fileFilter(req, file, cb) {
    if (
      ![allowedTypes]
        .map((type) => `.${type}`)
        .includes(path.extname(file.originalname))
    ) {
      cb(new BadRequestException());
    }

    cb(null, true);
  }

  return multer({ storage, fileFilter }).single(field);
}

module.exports = { createStorage };
