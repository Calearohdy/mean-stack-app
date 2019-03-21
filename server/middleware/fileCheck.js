const multer = require('multer')

// GLOBAL
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

// multer storing image uploads
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error('Invalid File Type');
        if(isValid) {
            error = null
        }

        callback(null, 'server/images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

module.exports = multer({storage: storage}).single('image');