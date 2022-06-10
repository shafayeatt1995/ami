const {User} = require('@backend/db');

const isProOrTrial = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({message: 'unauthenticated'});
  }
  const user = await User.findById(req.user.user._id);
  if (user.subscription && user.subscription.end_date > Date.now()) {
    req.user.is_trial = user.subscription.trial;
    return next();
  } else {
    return res.status(401).send({message: 'user has no subscription'});
  }
};
module.exports = isProOrTrial;
