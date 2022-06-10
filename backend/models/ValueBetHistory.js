const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValueBetHistorySchema = new Schema(
  {
    value_bet_id: {type: Schema.Types.ObjectId, ref: 'ValueBet'},
    user_id: {type: Schema.Types.ObjectId, ref: 'User', index: true},
  },
  {strict: false, timestamps: true}
);
const ValueBetHistory = mongoose.model(
  'ValueBetHistory',
  ValueBetHistorySchema
);

ValueBetHistory.findSeen = async function (user_id) {
  const seen = await this.find({user_id}, {value_bet_id: 1});
  const seen_ids = seen.map((x) => x.value_bet_id);
  return seen_ids;
};

ValueBetHistory.deleteSeen = function (user_id) {
  return this.deleteMany({user_id});
};

module.exports = ValueBetHistory;
