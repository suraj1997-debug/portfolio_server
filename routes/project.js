const mongoose = require('mongoose');
const express = require('express');
const { addProject, getProjects, getprojectBySlug } = require('./controller/project');
const { adminMiddleware, checkAuth,upload } = require('./middleware/auth');
const router = express.Router();


router.post('/admin/project/create',checkAuth,adminMiddleware,upload.fields([
    {name:'frontend',maxCount:15},
    {name:'admindashboard',maxCount:15}
]),addProject);

router.get('/project/display',getProjects);

router.get('/getprojectBySlug/:slug',getprojectBySlug);

module.exports = router;


