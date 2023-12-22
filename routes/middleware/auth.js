const jwt = require('jsonwebtoken');
const multer = require('multer');
// const aws = require("aws-sdk");
// const multerS3 = require('multer-s3');
const shortid = require('shortid');
const env = require('dotenv');
const path = require('path');
const fs = require('fs');
env.config();


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads')
    },
    filename: function(req,file,cb){
        cb(null,shortid.generate() + '-' + file.originalname);
    }
})

// const storage = multer.memoryStorage();


// const s3 = new aws.S3({
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//         accessKeyId: process.env.ACCESS_KEY_ID,
//         region: process.env.REGION,
//       });

exports.upload = multer({ 
    storage
    // limits: {fileSize : 100000},
    // fileFilter: async function (req,file,cb) {
    //     // console.log('file',file);
    //     checkFileType(file,cb);
    // } 
})

// exports.uploadS3 = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.MY_BUCKET,
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             console.log('filename',file)
//           cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//           cb(null, shortid.generate() + '-' + file.originalname)
//         }
//       })
// })

// const s3 = new S3Client();

// const exports.uploadS3 = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'some-bucket',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, 'uploads/' + shortid.generate() + '-' + file.originalname)
//         }
//     })
// })

const checkFileType = (file,cb) =>{
    console.log('file',file);

    const fileTypes = /jpg|jpeg|png|gif/;

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimeType);

    if(mimeType && extName){
        return cb(null, true);
    }
    else{
        cb("Error : Images only !!")
    }
}

exports.checkAuth = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
    }
    else {
        return res.status(400).json({
            message: "Authorization Required"
        })
    }
    next();
}


exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(400).json({
            message: "Admin Access Denied"
        })

    }
    next();
}

exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== 'user') {
        return res.status(400).json({
            message: "User Access Denied"
        })

    }
    next();
}

