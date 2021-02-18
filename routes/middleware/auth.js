const jwt = require('jsonwebtoken');
const env = require('dotenv');
const multer  = require('multer');
const aws = require("aws-sdk");
const multerS3 = require('multer-s3');
const shortid = require('shortid');

env.config();

exports.checkAuth=(req,res,next)=>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const user = jwt.verify(token,process.env.JWT_SECRET);
        req.user = user;
    }
    else{
        return res.status(400).json({
            message:"Authorization Required"
        })
    }
    next();
}


exports.adminMiddleware=(req,res,next)=>{
    if(req.user.role !=='admin'){
        return res.status(400).json({
            message:"Admin Access Denied"
        })
      
    }
    next();
}

exports.userMiddleware=(req,res,next)=>{
    if(req.user.role !=='user'){
        return res.status(400).json({
            message:"User Access Denied"
        })
      
    }
    next();
}

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads')
    },
    filename: function(req,file,cb){
        cb(null,shortid.generate() + '-' + file.originalname);
    }
})

const s3 = new aws.S3({
    accessKeyId: 'AKIAIVXXVTGUWKBDXKWQ',
    secretAccessKey: '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'
})

exports.upload = multer({ storage })

exports.uploadS3 =multer({
    storage: multerS3({
        s3: s3,
        bucket: 'dev-suraj-app',
        acl: 'public-read',
        metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null,shortid.generate() + '-' + file.originalname)
        }
      })
})