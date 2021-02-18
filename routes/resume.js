const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { checkAuth, adminMiddleware } = require('./middleware/auth');
const { addResume, getResume, addProfile } = require('./controller/resume');
const multer  = require('multer');
const aws = require("aws-sdk");
const multerS3 = require('multer-s3');
const shortid = require('shortid');
const env = require('dotenv');

env.config();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads')
    },
    filename: function(req,file,cb){
        cb(null,shortid.generate() + '-' + file.originalname);
    }
})

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const upload = multer({ storage })

const uploadS3 =multer({
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

router.post('/admin/addResume',checkAuth,adminMiddleware,addResume);

router.get('/getResume',getResume);

router.post("/get-user-profile",checkAuth,adminMiddleware,uploadS3.single('profileImg'),addProfile);

module.exports = router;