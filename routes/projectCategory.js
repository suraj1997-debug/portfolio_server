const mongoose = require('mongoose');
const express = require('express');
const { addcat, getProjectCategories, updateCat, deleteCat, getProjectCategoryBySlug, getProjectCategoryByProjectSlug } = require('./controller/projectCategory');
const { checkAuth, adminMiddleware } = require('./middleware/auth');
const router = express.Router();

router.post('/admin/project/add-category',checkAuth,adminMiddleware,addcat);

router.get('/admin/project/get-categories',checkAuth,adminMiddleware,getProjectCategories);

router.post('/admin/project/update-category',checkAuth,adminMiddleware,updateCat);

router.post('/admin/project/delete-category',checkAuth,adminMiddleware,deleteCat);

router.get('/project/get-categories',getProjectCategories);

router.get('/getProjectCategoryBySlug/:slug',getProjectCategoryBySlug);

router.get('/getProjectCategoryByProjectSlug/:slug',getProjectCategoryByProjectSlug);

module.exports = router;