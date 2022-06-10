const express = require('express');
const router = express.Router();
const {Outcome} = require('@backend/db');

router.get('/', async function (req, res) {
  try {
    // const admins = new Set([
    //   '6181a1476a8b1f99203adb36',
    //   '6181a1476a8b1f99203adb3a',
    // ]);
    // if (admins.has(req.user.user._id)) {
    //   console.log('admin');
    //   return res.send(
    //     await Outcome.find({}).sort({
    //       priority: 1,
    //       label: 1,
    //     })
    //   );
    // }
    const {type} = req.query;
    let outcomes;
    if (type === 'in-play') {
      outcomes = await Outcome.findInPlay();
    } else {
      outcomes = await Outcome.findPreMatch();
    }
    res.send(outcomes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({success: false, message: 'Interval server error occured'});
  }
});

module.exports = router;
