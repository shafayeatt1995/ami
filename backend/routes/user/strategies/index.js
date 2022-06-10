const express = require('express');
const router = express.Router();
const {Strategy} = require('../../../db');
const {isProOrTrial, isSeller} = require('@backend/middlewares');

router.get('/', async (req, res) => {
  const {mode, page, filterBy, sortBy, search} = req.query;
  const types = {
    'in-play-alerts': 'in-play',
    'pre-match-alerts': 'pre-match',
  };
  // console.log("index, strategues", req.query);
  const type = types[req.query.type];
  // const { } = req.params;
  const user_id = req.user.user._id;
  const [total, strategies] = await Strategy.findAll(
    type,
    user_id,
    page,
    mode,
    filterBy,
    sortBy,
    search
  );
  res.json({total, strategies});
});

// Get strategies that can sell, is_from_market == false && is_for_sale == false
router.get('/can-sell', async (req, res) => {
  const user_id = req.user.user._id;
  const strategies = await Strategy.findCanSell(user_id);
  res.json(strategies);
});

router.get('/for-sale', async (req, res) => {
  try {
    const {filters, sorter, page, per_page} = req.query;
    const parsed_filters = JSON.parse(filters);
    const {total, strategies} = await Strategy.findForSale(
      parsed_filters,
      sorter,
      page,
      per_page
    );
    if (total) {
      res.send({
        success: true,
        data: {
          total,
          strategies,
        },
      });
    } else {
      res.send({
        success: false,
        message: 'Failed to fetch strategies for sale',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/strike-rates', async (req, res) => {
  try {
    const user_id = req.user.user._id;
    const user_stategies = await Strategy.getUserStrategies(user_id);
    const other_stategies = await Strategy.getOtherStrategies(user_id);
    res.json({
      user_stategies,
      other_stategies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.use('/', isProOrTrial);

router.post('/exclude-league/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {league_id} = req.body;
    const user_id = req.user.user._id;

    await Strategy.excludeLeague(id, user_id, league_id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/update-leagues/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const {leagues} = req.body;
    const user_id = req.user.user._id;
    if (leagues.length > 2000) {
      return res.status(404).send({message: 'Not found'});
    }

    await Strategy.updateLeagues(id, user_id, leagues);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/trust/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    await Strategy.trust(id, user_id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/untrust/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    await Strategy.untrust(id, user_id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/toggle-active/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    const strategy = await Strategy.toggle(id, user_id);
    res.send(strategy);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/toggle-mute/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    const strategy = await Strategy.toggleMute(id, user_id);
    res.send(strategy);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/clone/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    const strategy = await Strategy.import(id, user_id);
    res.send({strategy, success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/import/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    const strategy = await Strategy.import(id, user_id);
    res.send(strategy);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    await Strategy.deleteByStrategyId(id, user_id);
    res.send({success: true, message: 'Strategy deleted'});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.post('/update-hitrate/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    await Strategy.updateHitrate(id, user_id);
    res.send({success: true, message: 'Strategy deleted'});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/id', async (req, res) => {
  try {
    const {id} = req.query;
    const user_id = req.user.user._id;
    const strategy = await Strategy.view(id, user_id);
    res.json(strategy);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/hits/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user_id = req.user.user._id;
    const hits = await Strategy.findHits(id, user_id);
    res.send(hits);
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.use('/in-play-alerts', require('./in-play'));
router.use('/pre-match-alerts', require('./prematch'));
router.use('/picks', require('./picks'));
router.use('/seller', isSeller, require('./seller'));

module.exports = router;
