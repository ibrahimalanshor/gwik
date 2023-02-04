const { access, constants } = require('fs/promises');

exports.checkFileExists = async function (path) {
  try {
    await access(path, constants.R_OK);

    return true;
  } catch (err) {
    return false;
  }
};
