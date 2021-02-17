const mongoose = require('mongoose');
const express = require('express');
const { signup, login, logout } = require('../controller/admin/admin');
const { checkAuth, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/admin/signup',signup);

router.post('/admin/login',login);

router.post('/admin/logout',checkAuth,adminMiddleware,logout);

module.exports = router;
