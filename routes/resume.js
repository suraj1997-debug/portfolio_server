const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { checkAuth, adminMiddleware } = require('./middleware/auth');
const { addResume, getResume, addProfile } = require('./controller/resume');
const multer = require("multer");
const shortid = require('shortid');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,shortid.generate() + '-' + file.originalname)
    }
  })

  var upload = multer({ storage });


router.post('/admin/addResume',checkAuth,adminMiddleware,addResume);

router.get('/getResume',getResume);

router.post("/get-user-profile",checkAuth,adminMiddleware,upload.single('profileImg'),addProfile);

module.exports = router;