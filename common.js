const multer = require('multer');
const fs = require('fs');

const dir = './../uploads/videos'; // Path para upar video
if (!fs.existsSync(dir)) {  // Criar diretorio caso não tenha
    fs.mkdirSync(dir, { recursive: true });  // mkdirSync para criar um diretorio
} 

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: fileStorageEngine });

module.exports = upload;
