const {User} = require('@backend/db');

const isSeller = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({message: 'unauthenticated'});
  }
  const user = await User.findById(req.user.user._id);
  if (user.is_seller) {
    return next();
  } else {
    return res.status(401).send({message: 'user is not seller'});
  }
};
module.exports = isSeller;
