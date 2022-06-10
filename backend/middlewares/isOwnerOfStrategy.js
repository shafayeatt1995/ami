const {User, Strategy} = require('@backend/db');

const isOwnerOfStrategy = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({message: 'unauthenticated'});
  }
  const user = await User.findById(req.user.user._id);
  if (!user.is_seller) {
    return res.status(401).send({message: 'user is not seller'});
  } else {
    if (!req.params.id) {
      return res.status(404).send({message: 'strategy_id is not provided'});
    }
    const strategy_id = req.params.id;
    const strategy = await Strategy.findByIdWithProjection(strategy_id, {
      user_id: 1,
    });
    if (strategy.user_id != req.user.user._id) {
      return res
        .status(403)
        .send({message: 'seller is not owner of the strategy'});
    }
    return next();
  }
};
module.exports = isOwnerOfStrategy;
