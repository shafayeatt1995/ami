const express = require('express');
const router = express.Router();
const {Rule} = require('../../db');

router.get('/pre-match', async (req, res) => {
  try {
    const pre_match_rules = await Rule.findAllPreMatch();
    res.json(pre_match_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/in-play', async (req, res) => {
  try {
    const in_play_rules = await Rule.findAllInPlay();
    res.json(in_play_rules);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

module.exports = router;
