const mongoose = require('mongoose');
const express = require('express');
const { addProject, getProjects, getprojectBySlug } = require('./controller/project');
const { adminMiddleware, checkAuth } = require('./middleware/auth');
const router = express.Router();
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


router.post('/admin/project/create',checkAuth,adminMiddleware,uploadS3.fields([
    {name:'frontend',maxCount:15},
    {name:'admindashboard',maxCount:15}
]),addProject);

router.get('/project/display',getProjects);

router.get('/getprojectBySlug/:slug',getprojectBySlug);

module.exports = router;


