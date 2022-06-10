const express = require('express');
const router = express.Router();
const {User, League} = require('../../db');

router.get('/', async (req, res) => {
  try {
    const leagues = await League.findAll();
    res.json(leagues);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/countries', async (req, res) => {
  try {
    const countries = await League.groupByCountries();
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/league-all', async (req, res) => {
  try {
    const {strategy_type} = req.query;
    const user_id = req.user.user._id;
    // const league_ids = [ 172, 711 ];
    const league_ids = await User.getLeagues(user_id, strategy_type);
    const leagues = await League.findByLeagueIds(league_ids);
    res.json(leagues);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: err});
  }
});

router.post('/league-all/', async (req, res) => {
  try {
    const {strategy_type, included_leagues} = req.body;
    const user_id = req.user.user._id;
    if (included_leagues.length > 2000) {
      return res
        .status(404)
        .send({message: 'Too many leagues: over 2000 leagues requested.'});
    }
    const user = await User.updateLeagues(
      user_id,
      strategy_type,
      included_leagues
    );
    res.send({success: true, user});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

module.exports = router;
