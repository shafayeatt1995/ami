const express = require('express');
const router = express.Router();
const {PageVideo} = require('@backend/db');

router.get('/', async (req, res) => {
  try {
    const page_video = await PageVideo.findForAdmin();
    res.json(page_video);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.post('/create', async (req, res) => {
  try {
    const page_videos = await PageVideo.createOrUpdateByAdmin(req.body);
    res.json(page_videos);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

router.get('/toggle-active/', async (req, res) => {
  try {
    const {id} = req.query;
    await PageVideo.toggleByAdmin(id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

router.get('/delete/', async (req, res) => {
  try {
    const {id} = req.query;
    await PageVideo.findByIdAndDelete(id);
    res.send({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).send({success: false, message: 'Internal server error'});
  }
});

module.exports = router;
