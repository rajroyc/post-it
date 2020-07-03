const multer = require('multer');

// maps the regular http content-type header value to a relevant file extension
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  // multer will intercept the req and when it invokes this storage engine,
  // it will send the
  // 1. req object,
  // 2. the file that was part of the multipart/form requests, and
  // 3. a callback function which the storage engine can call
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    // return an error to the callback if we were unable to map the content-type to a relevant extension
    if (isValid) {
      // callback requires two arguments:
      // error if any. setting to null here indicating there was no error
      // destination path of the file. This path is relative to server.js location
      // since the app is running from server.js
      cb(null, "backend/images");
    } else {
      cb(new Error('Invalid mime type ' + file.mimetype), '');
    }
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})


module.exports = storage;
