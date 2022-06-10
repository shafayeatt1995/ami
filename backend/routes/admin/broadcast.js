const express = require('express');
const router = express.Router();
const {Broadcast, User} = require('@backend/db');

const uuid = require('uuid');
const moment = require('moment');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post('/send', async (req, res) => {
  try {
    await Broadcast.create(req.body);
    const users = await User.findAppUsers(req.body.audience);
    sendAppBroadcast(req.body, users);
    res.json({success: true});
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, messsage: 'error'});
  }
});

/**
 *
 * @param {*} {title, body, audience}
 * @param {*} users
 * @return {array} users
 */
async function sendAppBroadcast({title, message}, users) {
  const admin = require('firebase-admin');
  const firebaseAlerts = admin.firestore().collection('alerts');
  console.log('sending broadcast to', users.length, 'users');
  const retries = [];
  for (const user of users) {
    let user_message = `<b>${title}</b>\n${message}`;
    user_message = user_message.replace('[Name]', user.firstname);
    try {
      await firebaseAlerts.doc(uuid.v4()).set({
        type: 'broadcast',
        user_id: '' + user._id,
        sending_time: moment().unix(),
        message: user_message,
      });
    } catch (err) {
      console.log(err);
      retries.push(user);
      delay(4000);
    }
    // console.log(user);
  }
  if (retries.length) {
    await sendAppBroadcast({title, message}, retries);
  }
  return users;
}

module.exports = router;
