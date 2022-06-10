const {User} = require('@backend/db');

const isPro = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({message: 'unauthenticated'});
  }
  const user = await User.findById(req.user.user._id);
  if (
    user.subscription &&
    user.subscription.trial != true &&
    user.subscription.end_date > Date.now()
  ) {
    return next();
  } else {
    return res.status(401).send({message: 'user not pro'});
  }
};
module.exports = isPro;
