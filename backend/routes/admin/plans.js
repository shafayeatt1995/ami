const express = require('express');
const router = express.Router();
const {Plan} = require('@backend/db');

router.get('/', async (req, res) => {
  try {
    const plans = await Plan.findForAdmin();
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.post('/create', async (req, res) => {
  try {
    const plan = await Plan.createByAdmin(req.body);
    res.json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.post('/edit', async (req, res) => {
  try {
    const plan = await Plan.editByAdmin(req.body);
    res.json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/delete/', async (req, res) => {
  try {
    const {id} = req.query;
    await Plan.deleteById(id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

module.exports = router;
