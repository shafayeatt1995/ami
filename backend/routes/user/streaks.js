const express = require('express');
const router = express.Router();
const {Fixture, User} = require('@backend/db');

router.get('/:market', async (req, res) => {
  try {
    const {market} = req.params;

    const {subscription} = await User.findById(req.user.user._id);
    const streak = await Fixture.fetchStreaks(
      market,
      !subscription || subscription.trial
    );
    // console.log(req.user.user);

    res.json(streak);
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: error});
  }
});

module.exports = router;
