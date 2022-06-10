const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const ValueBetSchema = new Schema(
  {
    fixture_ids: {type: Array},
    timestamp: Number,
    odds_stack: {type: Number},
    hash: {type: Number, unique: true},
  },
  {strict: false}
);
const ValueBet = mongoose.model('ValueBet', ValueBetSchema);

// ValueBet.findCombo = async function (user_id, odds_stack) {
//   odds_stack = Number(odds_stack);
//   if (!user_id) {
//     throw new Error("User id is required");
//   }
//   const ValueBetHistory = require("./ValueBetHistory");
//   const seen_ids = await ValueBetHistory.findSeen(user_id);
//   const value_bet = await this.findOne(
//     {
//       // _id: { $nin: seen_ids },
//       odds_stack,
//     },
//     { fixtures: 1 }
//   )
//     .sort({ timestamp: 1 })
//     .lean();
//   if (!value_bet) {
//     if (seen_ids.length > 0) {
//       await ValueBetHistory.deleteSeen(user_id);
//       return this.findCombo(user_id, odds_stack);
//     } else {
//       return null;
//     }
//   } else {
//     await ValueBetHistory.create({
//       value_bet_id: value_bet._id,
//       user_id,
//     });
//     return value_bet;
//   }
// };

ValueBet.findCombo = async function (skip, odds_stack) {
  odds_stack = Number(odds_stack);
  const value_bet = await this.findOne(
    {
      // _id: { $nin: seen_ids },
      odds_stack,
      timestamp: {$gt: moment().utc().unix()},
    },
    {fixtures: 1}
  )
    .sort({timestamp: 1})
    .skip(skip)
    .lean();

  return value_bet;
};
module.exports = ValueBet;
