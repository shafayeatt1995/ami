const express = require('express');
const router = express.Router();
const {Strategy, Fixture} = require('@backend/db');
const {body} = require('express-validator');

router.get('/results/', async (req, res) => {
  try {
    const {id, page, date} = req.query;
    const strategy = await Strategy.findByStrategyId(id, req.user.user._id);
    // console.log(strategy);
    const fixtures = await Fixture.findResults(strategy, 'past', date, page);
    res.json({
      fixtures,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({success: true, message: 'Internal server error'});
  }
});
router.get('/upcoming/', async (req, res) => {
  try {
    const {id, page, date, perPage} = req.query;
    const strategy = await Strategy.findByStrategyId(id, req.user.user._id);
    // console.log(strategy);
    const fixtures = await Fixture.findResults(
      strategy,
      'upcoming',
      date,
      page,
      perPage
    );
    res.json({
      fixtures,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({success: true, message: 'Internal server error'});
  }
});

router.post(
  '/create',
  body('title').isLength({min: 3, max: 50}),
  body('strategy_prematch_rules').isArray({min: 3, max: 20}),
  async (req, res) => {
    try {
      const user_id = req.user.user._id;
      await Strategy.createOrUpdate(req.body, 'pre-match', user_id);
      res.send({success: true, message: 'Strategy created'});
    } catch (err) {
      console.error(err);
      res.status(500).send({success: true, message: 'Internal server error'});
    }
  }
);

module.exports = router;
