const express = require('express');
const router = new express.Router();
const moment = require('moment');
const {Fixture, User} = require('../../../db');
router.get('/', async (req, res) => {
  try {
    const date = req.query.date || moment.utc().format('YYYY-MM-DD');
    const fixtures = await Fixture.findByDateGrouped(date);
    return res.send(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/search', async (req, res) => {
  try {
    const {search_text, type} = req.query;
    const fixtures = await Fixture.search(search_text, type);
    return res.send(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/live', async (req, res) => {
  try {
    const {page} = req.query;
    const fixtures = await Fixture.findLive(page);
    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.post('/sorted', async (req, res) => {
  try {
    const date = req.body.date || moment.utc().format('YYYY-MM-DD');
    const {page, ft_results, upcoming, filters} = req.body;
    const [fixtures, total] = await Fixture.findByDateSorted(
      date,
      page,
      ft_results,
      upcoming,
      filters
    );
    res.json({fixtures, total});
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/live-feed', async (req, res) => {
  try {
    const {ids} = req.query;
    if (!ids || ids.length > 500) {
      return res.send([]);
    }
    const fixtures = await Fixture.findLiveFeed(ids);
    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.post('/ids', async (req, res) => {
  try {
    const fixtures = await Fixture.findByIds(req.body.fixture_ids);
    res.json(fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/favorite-fixtures', async (req, res) => {
  try {
    const user_id = req.user.user._id;
    const favorite_fixtures = await User.getFavoriteFixtures(user_id);
    res.json(favorite_fixtures);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.post('/favorite-fixtures', async (req, res) => {
  try {
    const {fixture_id, addOrRemove} = req.body;
    const user_id = req.user.user._id;
    const user = await User.toggleFavoriteFixture(user_id, {
      fixture_id,
      addOrRemove,
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.delete('/favorite-fixtures', async (req, res) => {
  try {
    const user_id = req.user.user._id;
    const user = await User.clearFavoriteFixtures(user_id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/:fixture_id', async (req, res) => {
  try {
    const {fixture_id} = req.params;
    const fixture = await Fixture.findByFixtureId(fixture_id);
    res.json(fixture);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

module.exports = router;
