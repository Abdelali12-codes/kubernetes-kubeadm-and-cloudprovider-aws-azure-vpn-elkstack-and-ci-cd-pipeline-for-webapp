const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const mime = require('mime');

const upload = multer({
  storage: multer.diskStorage({
    destination (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename (req, file, cb) {
      cb(null, `${uuid()}.${mime.getExtension(file.mimetype)}`);
    }
  }),
  fileFilter (req, file, cb) {
    const mime = file.mimetype;
    cb(null, mime.indexOf('image') >= 0);
  }
});

module.exports = upload;