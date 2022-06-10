const express = require('express');
const router = express.Router();

router.use('/streaks', require('./streaks'));

module.exports = router;
