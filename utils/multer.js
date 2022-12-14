const multer = require('multer')
const path = require('path')

module.exports = multer({
    storage: multer.diskStorage({}), // since we won't be using local storage
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
    fileFilter: function (req, file, cb) {

        // To reject this file pass `false`, like so:
        if (!file.mimetype.match(/png||jpeg||jpg||gif$i/)) {
            // You can always pass an error if something goes wrong:
            cb(new Error('I don\'t have a clue!'), false)
            return;
        }
        // To accept the file pass `true`, like so:
        cb(null, true);
    }


})
