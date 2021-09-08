const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { checkAuth, adminMiddleware,uploadS3 } = require('./middleware/auth');
const { addResume, getResume, addProfile, generateResumePdf, downloadResumePdf } = require('./controller/resume');


router.post('/admin/addResume',checkAuth,adminMiddleware,addResume);

router.get('/getResume',getResume);

router.post("/get-user-profile",checkAuth,adminMiddleware,uploadS3.single('profileImg'),addProfile);

//pdf create apis
//generate resume pdf (new api)
router.post('/generateResumePdf',generateResumePdf);

//download resume pdf (new api)
router.get('/downloadResumePdf/:filename',downloadResumePdf);

module.exports = router;