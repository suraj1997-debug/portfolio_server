const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { checkAuth, adminMiddleware,uploadS3 } = require('./middleware/auth');
const { addResume, getResume, addProfile } = require('./controller/resume');


router.post('/admin/addResume',checkAuth,adminMiddleware,addResume);

router.get('/getResume',getResume);

router.post("/get-user-profile",checkAuth,adminMiddleware,uploadS3.single('profileImg'),addProfile);

module.exports = router;