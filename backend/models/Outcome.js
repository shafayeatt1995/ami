const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OutcomeSchema = new Schema(
  {
    // id: { type: Number, required: true },
    code: {type: String, required: true},
    label: {type: String, required: true},
    active: Boolean,
    is_bet_builder: Boolean,
    priority: {type: Number, default: 0}, // just used for ordering in the list
    type: {
      // used only for pre-match strategy or in-play or both.
      type: String,
      required: true,
      enum: ['both', 'pre-match', 'in-play'],
      default: 'both',
    },
  },
  {strict: false}
);
const active =
  process.env.DOMAIN === 'dashboard.footyamigo.com'
    ? true
    : {$in: [true, false]};
const Outcome = mongoose.model('Outcome', OutcomeSchema);

Outcome.findActive = function () {
  return this.find({active}).sort({priority: 1, label: 1});
};

Outcome.findPreMatch = function () {
  return this.find({active, type: {$ne: 'in-play'}}).sort({
    priority: 1,
    label: 1,
  });
};

Outcome.findInPlay = function () {
  return this.find({active}).sort({
    priority: 1,
    label: 1,
  });
};

Outcome.bulkCreate = function (items) {
  items = items.map((item) => {
    const {id, code, is_bet_builder, active, label} = item;
    return {
      id,
      code,
      is_bet_builder,
      label,
      active,
    };
  });
  return this.insertMany(items);
};

Outcome.findBetBuilders = function () {
  return this.find({
    is_bet_builder: true,
    active: true,
  });
};

// Outcome.find({}, { _id: 1, id: 1 })
//   .lean()
//   .then((outcomes) => {
//     //savehmap to json
//     const json = JSON.stringify(outcomes);
//     //write to file
//     const fs = require("fs");
//     fs.writeFile("./outcomes_hmap.json", json, (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   });
module.exports = Outcome;
