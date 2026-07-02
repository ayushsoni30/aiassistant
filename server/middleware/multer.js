import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public"); // destination of the uploaded files
    },

    //setting the file name
    filename: function (req, file, cb) {
        cb(null, file.originalname);

    }
})
//storing the multer storage in a variable
const upload = multer({ storage: storage });

export default upload; 