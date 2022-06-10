const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {ObjectId} = mongoose.Types;
const BetBuilderSchema = new Schema(
  {
    rules: [
      {
        rule_id: {type: ObjectId, ref: 'Rule', required: true},
        location: {type: String, required: true},
        team: {type: String, required: true},
        comparator: {type: String, required: true},
        value: {type: Number},
        values: Array,
        category: String,
        code: String,
        overall: String,
        home: String,
        label: String,
        away: String,
        direct: Boolean,
      },
    ],
    probabilities: [
      {
        rule_id: {type: ObjectId, ref: 'Rule', required: true},
        comparator: {type: String, required: true},
        value: {type: Number, required: true},
        code: String,
        category: String,
        label: String,
      },
    ],
    title: {type: String, required: true},
    leagues: {type: Array, required: true},
    active: {type: Boolean, required: true, default: false},
    outcome: {type: String, required: true},
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const BetBuilder = mongoose.model('BetBuilder', BetBuilderSchema);

BetBuilder.findActive = function () {
  return this.find({active: true});
};

BetBuilder.findForAdmin = function () {
  return this.find().sort({updated: -1});
};

BetBuilder.toggleByAdmin = function (id) {
  return this.findByIdAndUpdate(id, [
    {$set: {active: {$eq: [false, '$active']}}},
  ]);
};

/**
 *
 * @param {array} rules
 * @return {array}
 */
function formatBetBuilderProbabilities(rules) {
  return rules.map((x) => {
    const {code, category, label, direct} = x.rule_id;
    return {
      ...x,
      rule_id: x.rule_id._id,
      code,
      category,
      label,
      direct,
    };
  });
}

/**
 *
 * @param {array} probabilities
 * @return {array}
 */
function formatBetBuilderRules(probabilities) {
  return probabilities.map((x) => {
    const {code, category, overall, home, label, away, direct} = x.rule_id;
    return {
      ...x,
      rule_id: x.rule_id._id,
      code,
      category,
      overall,
      home,
      label,
      away,
      direct,
    };
  });
}

/**
 *
 * @param {*} body
 * @return {object}
 */
BetBuilder.createOrUpdateByAdmin = async function (body) {
  const {title, outcome, note, leagues, rules, probabilities, _id, active} =
    body;
  const session = await this.startSession();
  return await session.withTransaction(async () => {
    const bet_builder = _id
      ? await BetBuilder.findByIdAndUpdate(
          _id,
          {
            title,
            outcome,
            note,
            leagues,
            rules,
            active,
            probabilities,
          },
          {new: true}
        )
      : await BetBuilder.create({
          title,
          outcome,
          note,
          leagues,
          rules,
          probabilities,
          active,
        });

    await bet_builder.populate('rules.rule_id');
    await bet_builder.populate('probabilities.rule_id');
    bet_builder.rules = formatBetBuilderRules(bet_builder.toObject().rules);
    bet_builder.probabilities = formatBetBuilderProbabilities(
      bet_builder.toObject().probabilities
    );
    await bet_builder.save();
    return bet_builder;
  });
};
module.exports = BetBuilder;
