const { access, constants } = require('fs/promises');

exports.checkFileExists = async function (path) {
  try {
    await access(path);

    return true;
  } catch (err) {
    return false;
  }
};
