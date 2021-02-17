const mongoose = require('mongoose');
const express = require('express');
const { addcat, getProjectCategories, updateCat, deleteCat } = require('./controller/projectCategory');
const { checkAuth, adminMiddleware } = require('./middleware/auth');
const router = express.Router();

router.post('/admin/project/add-category',checkAuth,adminMiddleware,addcat);

router.get('/admin/project/get-categories',checkAuth,adminMiddleware,getProjectCategories);

router.post('/admin/project/update-category',checkAuth,adminMiddleware,updateCat);

router.post('/admin/project/delete-category',checkAuth,adminMiddleware,deleteCat);

module.exports = router;