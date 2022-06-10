const express = require('express');
const router = express.Router();
const {Fixture} = require('@backend/db');

router.get('/', async (req, res) => {
  try {
    const {market, form} = req.query;
    const streak = await Fixture.fetchStreakForWp(market, form);
    res.json(streak);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

module.exports = router;
