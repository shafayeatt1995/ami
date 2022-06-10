const express = require('express');
const router = express.Router();
const {Pick} = require('@backend/db');
const admin = require('firebase-admin');
const moment = require('moment');

/**
 *
 * @param {*} db
 * @param {*} query
 * @param {*} resolve
 * @return {Promise}
 */
async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;

  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

router.get('/', async (req, res) => {
  try {
    const user_id = req.user.user._id;
    const sent_to_user = await Pick.sentToUser(user_id);
    const sent_to_others = await Pick.sentToOthers(user_id);
    res.json({
      sent_to_user,
      sent_to_others,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({success: true, message: 'Internal server error'});
  }
});

router.get('/delete-alerts', async (req, res) => {
  try {
    const user_id = req.user.user._id;
    const Alert = admin.firestore().collection('alerts');
    const db = admin.firestore();
    const query = Alert.where('user_id', '==', user_id)
      .where('sending_time', '<', moment.utc().unix())
      .orderBy('sending_time', 'desc');
    res.send({success: 'Successfully deleted all alerts'});
    console.log('Deleting all alerts for user', req.user.user);
    await deleteQueryBatch(db, query, () => {
      return null;
    });
  } catch (error) {
    console.log('FAILED-TO-DELETE-ALERTS', error);
    res.status(400).send('Failed to delete alerts');
  }
});

module.exports = router;
