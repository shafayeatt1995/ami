const express = require('express');
const router = express.Router();
const {ValueBet} = require('@backend/db');
const {isProOrTrial} = require('@backend/middlewares');

router.get('/', isProOrTrial, async (req, res) => {
  try {
    // const user_id = req.user.user._id;
    const {odds_stack, skip} = req.query;
    const value_bet = await ValueBet.findCombo(
      Number(req.user.is_trial ? 0 : skip),
      odds_stack
    );
    if (!value_bet) {
      throw new Error('Value bet not found');
    }
    value_bet.fixtures = value_bet.fixtures.map((fixture, index) => {
      if (req.user.is_trial && index !== 0) {
        const {
          odds,
          bookie_chance,
          footyamigo_chance,
          indication,
          league_name,
          margin,
          footyamigo_odds,
        } = fixture;
        return {
          odds,
          bookie_chance,
          footyamigo_chance,
          indication,
          league_name,
          margin,
          footyamigo_odds,
        };
      } else {
        return fixture;
      }
    });
    res.json(value_bet);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: true, message: 'Internal server error'});
  }
});

module.exports = router;
