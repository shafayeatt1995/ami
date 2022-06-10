const express = require('express');
const router = express.Router();

const {User} = require('@backend/db');

router.post('/unlink-telegram', async (req, res) => {
  const {user_id} = req.body;
  await User.delTelegram(user_id);
});

module.exports = router;
