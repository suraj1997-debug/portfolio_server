const mongoose = require('mongoose');
const express = require('express');
const { addProject, getProjects, getprojectBySlug } = require('./controller/project');
const { adminMiddleware, checkAuth,upload,uploadS3 } = require('./middleware/auth');
const router = express.Router();


router.post('/admin/project/create',checkAuth,adminMiddleware,uploadS3.fields([
    {name:'frontend'},
    {name:'admindashboard'}
]),addProject);

router.get('/project/display',getProjects);

router.get('/getprojectBySlug/:slug',getprojectBySlug);

module.exports = router;


