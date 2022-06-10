const {User} = require('../../../db');
/**
 *
 * @param {*} req
 * @return {Promise<void>}
 */
async function getUser(req) {
  const user_id = req.user.user._id;
  const user = await User.findById(user_id);
  return user;
}

module.exports = {
  getUser,
};
