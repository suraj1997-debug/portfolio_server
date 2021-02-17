const mongoose = require("mongoose");
const express = require("express");
const { user } = require("./controller/user");
const { checkAuth, adminMiddleware } = require("./middleware/auth");
const router = express.Router();


router.get("/",user);

module.exports = router;