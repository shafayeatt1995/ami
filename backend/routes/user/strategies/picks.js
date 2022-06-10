const express = require('express');
const router = express.Router();
const {Pick} = require('../../../db');
// const { Op,Sequelize } = require('sequelize')
const converter = require('json-2-csv');

router.get('/', async (req, res) => {
  try {
    const {strategy_id, date, page} = req.query;
    // const filter_instance = await getStrategyWithPicks(id);
    const user_id = req.user.user._id;
    // const filter = await getRequiredStrategyData(filter_instance);
    const picks = await Pick.findWithFixture(strategy_id, user_id, date, page);

    res.json({
      picks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/export/', async (req, res) => {
  try {
    const {strategy_id, type} = req.query;
    const user_id = req.user.user._id;
    const keys = [
      'fixture_name',
      'country_name',
      'league_name',
      'home_name',
      'away_name',
      'ko_time',
      'status',
      'sending_time',
      'minute',
      'extra_minute',
      'type',
      'home_goals',
      'away_goals',
      'ht_score',
      'ft_score',
      'total_cards',
      'cards_1h',
      'cards_2h',
      'home_yellow_cards',
      'home_red_cards',
      'away_yellow_cards',
      'away_red_cards',
      'total_corners',
      'ht_corner',
      'ft_corner',
      'corners_1h',
      'corners_2h',
      'home_corners',
      'home_corners_1h',
      'home_corners_2h',
      'away_corners_1h',
      'away_corners_2h',
      'away_corners',
      'home_win_pre_match_odds',
      'draw_pre_match_odds',
      'away_win_pre_match_odds',
      'over_1_5_goals_pre_match_odds',
      'over_2_5_goals_pre_match_odds',
    ];
    if (type == 'in-play-alerts') {
      keys.push(
        ...[
          'o05_goals_in_play_odds',
          'u05_goals_in_play_odds',
          'o15_goals_in_play_odds',
          'u15_goals_in_play_odds',
          'o25_goals_in_play_odds',
          'u25_goals_in_play_odds',
          'o35_goals_in_play_odds',
          'u35_goals_in_play_odds',
          'o45_goals_in_play_odds',
          'u45_goals_in_play_odds',
          'o55_goals_in_play_odds',
          'u55_goals_in_play_odds',
        ]
      );
    }
    const picks = await Pick.export(strategy_id, user_id);
    const picks_csv = await converter.json2csvAsync(picks, {
      keys,
      emptyFieldValue: '',
    });
    // console.log(picks);
    res.attachment('picks.csv').send(picks_csv);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.post('/strike', async (req, res) => {
  try {
    const {pick_id, strike} = req.body;
    const user_id = req.user.user._id;
    const strike_rate = await Pick.updateStrike(pick_id, strike, user_id);
    res.json({strike_rate});
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/clearstrike', async (req, res) => {
  try {
    const {strategy_id} = req.query;
    const user_id = req.user.user._id;
    const picks = await Pick.clearStrike(strategy_id, user_id);
    res.json({picks});
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/league/delete', async (req, res) => {
  try {
    const {strategy_id, league_id} = req.query;
    const user_id = req.user.user._id;
    const picks = await Pick.deletePicksByLeague(
      strategy_id,
      league_id,
      user_id
    );
    res.json({
      picks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    await Pick.deleteById(id, user_id);
    res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;
