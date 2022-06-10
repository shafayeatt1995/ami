const express = require('express');
const router = express.Router();
const {BettingSystem, Strategy} = require('@backend/db');

router.get('/', async (req, res) => {
  try {
    const betting_systems = await BettingSystem.find();
    res.json(betting_systems);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/toggle-active/', async (req, res) => {
  try {
    const {id} = req.query;
    await BettingSystem.toggleByAdmin(id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/delete/', async (req, res) => {
  try {
    const {id} = req.query;
    await BettingSystem.findByIdAndDelete(id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/presets', async function (req, res, next) {
  try {
    const presets = await Strategy.findBetBuilders();
    res.send(presets);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({success: false, message: 'Interval server error occured'});
  }
});

router.post('/:action', async (req, res) => {
  try {
    const {action} = req.params;
    let betting_system;
    switch (action) {
      case 'create':
        betting_system = await BettingSystem.createByAdmin(req.body);
        break;
      case 'update':
        betting_system = await BettingSystem.updateByAdmin(req.body);
        break;
    }
    res.json(betting_system);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

module.exports = router;
