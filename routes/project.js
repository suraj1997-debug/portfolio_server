const mongoose = require('mongoose');
const express = require('express');
const { addProject, getProjects, getprojectBySlug } = require('./controller/project');
const { adminMiddleware, checkAuth } = require('./middleware/auth');
const router = express.Router();
const multer  = require('multer');
const shortid = require('shortid');

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./public/uploads')
    },
    filename: function(req,file,cb){
        cb(null,shortid.generate() + '-' + file.originalname);
    }
})

var upload = multer({ storage })


router.post('/admin/project/create',checkAuth,adminMiddleware,upload.fields([
    {name:'frontend'},
    {name:'admindashboard'}
]),addProject);

router.get('/project/display',getProjects);

router.get('/getprojectBySlug/:slug',getprojectBySlug);

module.exports = router;


