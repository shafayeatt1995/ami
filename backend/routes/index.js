const express = require('express');
const router = express.Router();

const {isAdmin, isLogged, isAuthenticated} = require('@backend/middlewares');

require('../controllers/auth');
require('../db');

router.use(isLogged);

router.use('/auth', require('./auth'));
router.use('/admin', isAdmin, require('./admin'));
router.use('/user', isAuthenticated, require('./user'));
router.use('/wp', require('./wp'));

// router.use("/rest", require("./rest"));
// router.use("/admins", require("./admins"));
// router.use("/direct", user);

module.exports = router;
