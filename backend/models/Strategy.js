const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const {ObjectId} = require('mongoose').Types;
const _ = require('lodash');
const axios = require('axios');

const PreMatchRuleSchema = new Schema(
  {
    rule_id: {type: ObjectId, ref: 'Rule'},
    rule: {type: Object},
    values: {type: Array},
    comparator: {type: String},
    value: {type: Number},
    team: {type: String},
    location: {type: String},
  },
  {
    strict: false,
  }
);

const InPlayRuleSchema = new Schema(
  {
    first_rule_id: {type: ObjectId, ref: 'Rule'},
    second_rule_id: {type: ObjectId, ref: 'Rule'},
    first_code: {type: String},
    second_code: {type: String},
    first_category: {type: String},
    second_category: {type: String},
    first_subcategory: {type: String},
    second_subcategory: {type: String},
    comparator: {type: String},
    value: {type: Number},
    odds_value: {type: Number},
    first_team: {type: String},
    second_team: {type: String},
    timer: {type: Object},
  },
  {
    strict: false,
    // timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// axios
//   .post(
//     'https://fd363hqz04.execute-api.us-east-1.amazonaws.com/default/strategy-mongodb-handler',
//     {
//       fullDocument: {
//         user: {
//           email: 'vishalbty@gmail.com',
//         },
//         _id: '627c35388d906656aaefc646',
//       },
//       operationType: 'update',
//     }
//   )
//   .then((res) => {
//     console.log('checking res');
//     console.log(res.data);
//   });

const SaleDetailSchema = new Schema(
  {
    seller_id: {type: ObjectId, ref: 'User'},
    price: {
      type: Number,
      validate: {
        validator: function (v) {
          return _.includes([0, 4.99, 9.99, 12.99], v);
        },
        message: (props) =>
          `Price can be only (£0, £4.99, £9.99, £12.99), £${props.value} is not a valid price!`,
      },
    },
    title: {type: String},
    note: {type: String},
    status: {type: Boolean, default: false},
    image_url: {type: String},
    total_subscribers: {type: Number},
    video_url: {type: String},
    is_rules_hidden: {type: Boolean, default: true},
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
    overall_rating: {type: Number, default: 0.0},
    buyers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  {
    strict: false,
    // timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const StrategySchema = new Schema(
  {
    is_preset: {type: Boolean, index: true, default: false},
    is_public: {type: Boolean, index: true, default: false},
    user_id: {type: ObjectId},
    _user: {type: Object},
    trusted: {type: Boolean, default: false},
    active: {type: Boolean, default: true},
    type: {type: String},
    outcome_id: {type: ObjectId},
    outcome: {type: Object},
    preset_id: {type: ObjectId, index: true},
    strategy_prematch_rules: [PreMatchRuleSchema],
    strategy_inplay_rules: [InPlayRuleSchema],
    title: String,
    note: String,
    timer: Object,
    leagues: Array,
    muted: {type: Boolean, default: false},
    hit_rate: {type: Number, default: 0.0},
    strike_rate: {type: Number, default: 0.0},
    fixtures_found: {type: Number, default: 0},
    picks_sent: {type: Number, default: 0},
    last_checked: {type: Date},

    is_for_sale: {type: Boolean, default: false},
    sale_detail: SaleDetailSchema,

    is_from_market: {type: Boolean, default: false},
    original_id: {type: Schema.Types.ObjectId, ref: 'Strategy'},
  },
  {
    strict: false,
    // toJSON: { virtuals: true },
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const Strategy = mongoose.model('Strategy', StrategySchema);

const Outcome = require('./Outcome');
const Rule = require('./Rule');
// Strategy.updateMany(
//   { user_id: 1 },
//   { $set: { user_id: "6181a1476a8b1f99203adb36" } }
// ).then((masti) => console.log(masti));

const Pick = require('./Pick');
const User = require('./User');

const uuid = require('uuid');

const strategy_public_fields = {
  id: 1,
  slug: 1,
  title: 1,
  is_public: 1,
  is_preset: 1,
  timer: 1,
  note: 1,
  type: 1,
  picks_sent: 1,
  hit_rate: 1,
  strike_rate: 1,
  outcome: 1,
  outcome_id: 1,
  leagues: 1,
  trusted: 1,
  preset_id: 1,
  active: 1,
  muted: 1,
  user_id: 1,
  track: 1,
};

/**
 *
 * @param {object} rule
 * @param {object} rules_map
 * @return {object}
 */
function formatPreMatch(rule, rules_map) {
  const {rule_id} = rule;
  const rule_data = rules_map[rule_id];
  const {code, category, overall, home, label, away, direct} = rule_data;
  return {
    ...rule,
    rule_id: ObjectId(rule_id),
    code,
    category,
    overall,
    home,
    label,
    away,
    direct,
  };
}

/**
 *
 * @param {object} rule
 * @param {object} rules_map
 * @return {object}
 */
function formatInPlay(rule, rules_map) {
  const {first_rule_id, second_rule_id} = rule;
  if (!first_rule_id) {
    return null;
  }
  const first_rule_data = rules_map[first_rule_id];
  const second_rule_data = rules_map[second_rule_id];
  return {
    ...rule,
    first_code: first_rule_data.code,
    second_code: second_rule_data ? second_rule_data.code : null,
    first_rule_id: ObjectId(first_rule_id),
    second_rule_id: second_rule_id ? ObjectId(second_rule_id) : null,
  };
}

/**
 *
 * @param {*} _id - strategy id
 * @return {boolean}
 */
// async function checkIfOutcomeHasChanged(_id) {
//   if (!_id) {
//     return false;
//   }
//   const strategy = await Strategy.findById(_id, {
//     outcome_id: 1,
//   }).lean();
//   return ObjectId(strategy.outcome_id) !== ObjectId(outcome_id);
// }

/**
 *
 * @param {object} strategy_prematch_rules
 * @param {object} strategy_inplay_rules
 * @return {object}
 */
async function populateRules(strategy_prematch_rules, strategy_inplay_rules) {
  const prematch_rule_ids = strategy_prematch_rules.map((x) => x.rule_id);
  const first_inplay_rule_ids = strategy_inplay_rules.map(
    (x) => x.first_rule_id
  );
  const second_inplay_rule_ids = strategy_inplay_rules.map(
    (x) => x.second_rule_id
  );
  const rule_ids = [
    ...prematch_rule_ids,
    ...first_inplay_rule_ids,
    ...second_inplay_rule_ids,
  ];
  const rules = await Rule.find({_id: {$in: rule_ids}}).lean();
  const rules_map = rules.reduce((acc, x) => {
    acc[x._id] = x;
    return acc;
  }, {});
  const prematch_rules_populated =
    strategy_prematch_rules.map((x) => formatPreMatch(x, rules_map)) || [];
  const inplay_rules_populated =
    strategy_inplay_rules
      .map((x) => formatInPlay(x, rules_map))
      .filter((x) => x != null) || [];

  // console.log("SEE THIS", prematch_rules_populated, inplay_rules_populated);
  return {prematch_rules_populated, inplay_rules_populated};
}
/**
 *
 * @param {*} strategy_type - pre-match or in-play
 * @param {*} outcome - outcome object
 * @return {boolean}
 */
function checkIfInplayOutcomeUsedInPrematch(strategy_type, outcome) {
  if (strategy_type === 'pre-match' && outcome.type === 'in-play') {
    return true;
  }

  return false;
}
Strategy.createOrUpdate = async function (
  body,
  type,
  user_id,
  preset_id,
  extra = {}
) {
  let {
    _id,
    title,
    strategy_prematch_rules,
    strategy_inplay_rules,
    outcome_id,
    is_public,
    timer,
    note,
    leagues,
  } = body;

  user_id = ObjectId(user_id);
  if (type === 'in-play' && !strategy_inplay_rules.length) {
    throw new Error('Strategy in-play rules are required');
  }
  if (type === 'pre-match' && !strategy_prematch_rules.length) {
    throw new Error('Strategy prematch rules are required');
  }

  const outcome = await Outcome.findById(outcome_id);

  if (checkIfInplayOutcomeUsedInPrematch(type, outcome)) {
    throw new Error('Outcome cannot be used in prematch strategy');
  }
  const user = await User.findById(user_id, {
    _id: 1,
    email: 1,
    firstname: 1,
    lastname: 1,
    utcoffset: 1,
    locale: 1,
    id: 1,
    subscription: 1,
    phone: 1,
  });

  // const has_outcome_changed = await checkIfOutcomeHasChanged(_id);
  // console.log("outcome changed", has_outcome_changed);
  // if (has_outcome_changed) {

  // }
  const {prematch_rules_populated, inplay_rules_populated} =
    await populateRules(strategy_prematch_rules, strategy_inplay_rules);
  // const session = await mongoose.startSession();
  // await session.withTransaction(async () => {
  if (_id) {
    await Strategy.findOneAndUpdate(
      {_id, user_id},
      {
        title,
        is_public,
        strategy_prematch_rules: prematch_rules_populated,
        strategy_inplay_rules: inplay_rules_populated,
        timer,
        note,
        leagues,
        type,
        outcome,
        user,
        outcome_id,
        ...extra,
      },
      {new: true}
    );
    if (type == 'pre-match') {
      axios
        .post(
          'https://2a0uvhglt5.execute-api.us-east-1.amazonaws.com/default/strategy-hits-trigger',
          {
            fullDocument: {
              user: {
                email: user.email,
              },
              _id: _id,
            },
            operationType: 'update',
          }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // .session(session);
    console.log('rescheduling', _id);
    // Strategy.reschedule(_id);
  } else {
    const [strategy_inserted] = await Strategy.create(
      [
        {
          title,
          is_public,
          timer,
          note,
          strategy_prematch_rules: prematch_rules_populated,
          strategy_inplay_rules: inplay_rules_populated,
          leagues,
          type,
          user,
          outcome,
          outcome_id,
          preset_id,
          user_id,
          slug: uuid.v4(),
          ...extra,
        },
      ]
      // { session }
    );
    _id = strategy_inserted._id;
    if (type == 'pre-match') {
      axios
        .post(
          'https://2a0uvhglt5.execute-api.us-east-1.amazonaws.com/default/strategy-hits-trigger',
          {
            fullDocument: {
              user: {
                email: user.email,
              },
              _id: _id,
            },
            operationType: 'update',
          }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // console.log("new one", strategy_inserted);
    console.log('rescheduling', strategy_inserted._id);
    // Strategy.reschedule(strategy_inserted._id);
    // const strategy_hits = await Hit.find(
    //   {strategy_id: parent_strategy_id},
    //   {_id: 0}
    // ).lean();

    // await Hit.insertMany(
    //   strategy_hits.map((hit) => {
    //     return {
    //       ...hit,
    //       strategy_id: _id,
    //     };
    //   })
    // );
  }
  // });
};

Strategy.import = async function (parent_strategy_id, user_id, user_is_pro) {
  user_id = ObjectId(user_id);
  const strategy = await Strategy.findByStrategyId(
    parent_strategy_id,
    user_id,
    user_is_pro
  );
  if (!strategy) {
    throw new Error('Strategy not found');
  }
  const preset_id = strategy.is_preset ? strategy._id : undefined;
  const {
    strategy_prematch_rules,
    strategy_inplay_rules,
    outcome_id,
    is_public,
    timer,
    note,
    type,
    leagues,
    muted,
    hit_rate,
    track,
    trusted,
  } = strategy;
  const title = strategy.user_id.equals(user_id)
    ? `Copy of ${strategy.title}`
    : strategy.title;

  return Strategy.createOrUpdate(
    {
      title,
      strategy_prematch_rules,
      strategy_inplay_rules,
      outcome_id,
      is_public,
      timer,
      note,
      leagues,
    },
    type,
    user_id,
    preset_id,
    {
      muted,
      hit_rate,
      track,
      trusted,
      parent_strategy_id,
    }
  );
};

Strategy.reschedule = async function (strategy_id) {
  try {
    const config = {headers: {}};
    const url =
      (process.env.CANCEL_PREMATCH_ALERTS_ENDPOINT ||
        'https://xqpq30njwk.execute-api.us-east-1.amazonaws.com/v1/strategies/') +
      strategy_id;
    await axios.put(url, {}, config);
    // console.log(res.data, "LAMBDA TRIGGERED");
  } catch (error) {
    console.log('Reschedule Error', error?.response?.data);
  }
};

Strategy.view = async function (_id, user_id, user_is_pro = false) {
  const projectQuery = {
    slug: 1,
    title: 1,
    timer: 1,
    note: 1,
    type: 1,
    picks_sent: 1,
    hit_rate: 1,
    strike_rate: 1,
    outcome: 1,
    outcome_id: 1,
    leagues: 1,
    trusted: 1,
    preset_id: 1,
    strategy_prematch_rules: 1,
    strategy_inplay_rules: 1,
    active: 1,
    track: 1,
  };
  if (user_is_pro) {
    return this.findOne({_id, is_preset: {$in: true}}, projectQuery);
  } else {
    return this.findOne(
      {
        $or: [
          {
            _id,
            user_id: ObjectId(user_id),
          },
          {
            _id,
            is_public: true,
          },
        ],
      },
      projectQuery
    );
  }
};

Strategy.findByStrategyId = async function (_id, user_id, user_is_pro = false) {
  if (user_is_pro) {
    return this.findOne({_id, is_preset: {$in: true}}).lean();
  } else {
    return this.findOne({
      $or: [
        {
          _id,
          user_id: ObjectId(user_id),
        },
        {
          _id,
          is_public: true,
        },
      ],
    }).lean();
  }
};

Strategy.findAll = async function (
  type,
  user_id,
  page = 1,
  mode,
  filterBy = 'all',
  sortBy = 'status',
  search
) {
  page = Math.max(Number(page || 1), 0);

  const PER_PAGE = mode === 'upcoming-alerts' ? 3 : 20;

  const skip = (page - 1) * PER_PAGE;
  const matchQuery = {type};
  const sortQuery = {};
  const projectQuery = {
    hit_rate: 1,
    id: 1,
    title: 1,
    strike_rate: 1,
    picks_sent: 1,
    trusted: 1,
    updated_at: 1,
    outcome: 1,
    active: 1,
    muted: 1,
    slug: 1,
  };
  user_id = ObjectId(user_id);
  switch (filterBy) {
    case 'active':
      Object.assign(matchQuery, {active: {$in: [1, true]}});
      break;
    case 'inactive':
      Object.assign(matchQuery, {active: {$in: [0, false]}});
      break;
  }
  if (search) {
    Object.assign(matchQuery, {
      $or: [{title: {$regex: search, $options: 'i'}}],
    });
  }

  switch (mode) {
    case 'explore-alerts':
      Object.assign(matchQuery, {
        is_public: {$in: [1, true]},
        preset_id: null,
        is_preset: {$nin: [1, true]},
        user_id: {$ne: user_id},
        'user.subscription.end_date': {$gt: new Date()},
      });
      break;
    case 'preset-alerts':
      Object.assign(matchQuery, {
        is_preset: {$in: [1, true]},
        is_public: {$in: [1, true]},
      });
      break;
    case 'upcoming-alerts':
      Object.assign(matchQuery, {active: {$in: [1, true]}, user_id});
      break;
    default:
      // await this.updateHitrates(user_id, type);
      Object.assign(matchQuery, {
        user_id,
      });
  }

  switch (sortBy) {
    case 'picks_sent':
      Object.assign(sortQuery, {picks_sent: -1});
      break;
    case 'hit_rate':
      if (type == 'in-play') {
        Object.assign(sortQuery, {strike_rate: -1});
      } else {
        Object.assign(sortQuery, {hit_rate: -1});
      }
      break;
    case 'name':
      Object.assign(sortQuery, {title: 1});
      break;
    case 'updated_at':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    default:
      Object.assign(sortQuery, {trusted: -1});
  }

  const [total, strategies] = await Promise.all([
    this.countDocuments(matchQuery),
    this.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: PER_PAGE,
      },
      {
        $project: projectQuery,
      },
    ]),
  ]);

  return [total, strategies];
};

Strategy.findCanSell = async function (user_id) {
  user_id = ObjectId(user_id);
  const matchQuery = {
    user_id,
    is_for_sale: {$ne: true},
    is_from_market: {$ne: true},
  };
  const projectQuery = {
    id: 1,
    title: 1,
    outcome: 1,
    type: 1,
  };

  const strategies = await this.aggregate([
    {
      $match: matchQuery,
    },
    {
      $project: projectQuery,
    },
  ]);

  return strategies;
};

Strategy.findForSale = async function (
  filters,
  sorter = 'number_of_subscribers',
  page = 1,
  per_page = 8
) {
  page = Math.max(Number(page || 1), 0);
  per_page = Math.max(Number(per_page || 1), 0);

  const skip = (page - 1) * per_page;
  const matchQuery = {
    is_for_sale: true,
    is_from_market: {$ne: true},
    'sale_detail.status': true,
  };
  const sortQuery = {};
  const projectQuery = {
    _id: 1,
    'sale_detail.title': 1,
    image_url: 1,
    video_url: 1,
    'sale_detail.overall_rating': 1,
    hit_rate: 1,
    // total_subscribers: 1, // calculated from buyers[].length
  };

  // TODO: filter
  switch (filters.picked_matches_overall) {
    case 'all':
      break;
    case 'over-50':
      break;
    case 'over-100':
      break;
    case 'over-200':
      break;
    case 'over-500':
      break;
    case 'over-1000':
      break;
    case 'over-2000':
      break;
    case 'over-5000':
      break;
    default:
      console.log('default');
  }
  // TODO: other filters

  // TODO: sorter
  switch (sorter) {
    case 'number_of_subscribers':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    case 'reviews_score':
      Object.assign(sortQuery, {'sale_detail.overall_rating': -1});
      break;
    case 'number_of_reviews':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    case 'picked_matches_over_all':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    case 'picked_matches_last_7_days':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    default:
      Object.assign(sortQuery, {updated_at: -1});
  }

  const [total, strategies] = await Promise.all([
    this.countDocuments(matchQuery),
    this.aggregate([
      {
        $match: matchQuery,
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: per_page,
      },
      {
        $project: projectQuery,
      },
    ]),
  ]);

  return {total, strategies};
};

// Get strategies for-sale for specific seller.
Strategy.findForSeller = async function (
  seller_id,
  filters,
  sorter = 'title',
  page = 1,
  per_page = 20
) {
  page = Math.max(Number(page || 1), 0);
  per_page = Math.max(Number(per_page || 1), 0);

  // check if seller_id is seller or not
  const seller = await User.findById(seller_id, {
    _id: 1,
    is_seller: 1,
  });

  if (!seller || (seller && !seller.is_seller)) {
    return new Error('User is not seller.');
  }

  const skip = (page - 1) * per_page;
  const matchQuery = {
    is_for_sale: true,
    is_from_market: {$ne: true},
    user_id: ObjectId(seller_id),
  };
  const sortQuery = {};
  const projectQuery = {
    _id: 1,
    type: 1,
    'sale_detail.title': 1,
    hit_rate: 1,
    strike_rate: 1,
    'sale_detail.price': 1,
    image_url: 1,
    // total_subscribers: 1, // calculated from buyers[].length
    'sale_detail.is_rules_hidden': 1,
    'sale_detail.status': 1,
  };

  // TODO: filter
  switch (filters.picked_matches_overall) {
    case 'all':
      break;
    case 'over-50':
      break;
    case 'over-100':
      break;
    case 'over-200':
      break;
    case 'over-500':
      break;
    case 'over-1000':
      break;
    case 'over-2000':
      break;
    case 'over-5000':
      break;
    default:
      console.log('default');
  }
  // TODO: other filters

  // TODO: sorter
  switch (sorter) {
    case 'title':
      Object.assign(sortQuery, {'sale_detail.title': 1});
      break;
    case 'number_of_subscribers':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    case 'reviews_score':
      Object.assign(sortQuery, {'sale_detail.overall_rating': -1});
      break;
    case 'number_of_reviews':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    case 'picked_matches_over_all':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    case 'picked_matches_last_7_days':
      Object.assign(sortQuery, {updated_at: -1});
      break;
    default:
      Object.assign(sortQuery, {updated_at: -1});
  }
  try {
    const [total, strategies] = await Promise.all([
      this.countDocuments(matchQuery),
      this.aggregate([
        {
          $match: matchQuery,
        },
        {
          $sort: sortQuery,
        },
        {
          $skip: skip,
        },
        {
          $limit: per_page,
        },
        {
          $project: projectQuery,
        },
      ]),
    ]);
    return {total, strategies};
  } catch (error) {
    console.log('Failed to fetch');
    return new Error('Failed to fetch');
  }
};

Strategy.updateForSale = function (_id, strategy_data) {
  return this.findByIdAndUpdate(_id, strategy_data, {new: true});
};

Strategy.removeFromForSale = async function (_id) {
  try {
    await this.findByIdAndUpdate(_id, [{$set: {is_for_sale: false}}]);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

Strategy.findAllByAdmin = function (type, user_id, page = 1) {
  page = Math.max(Number(page), 0);
  const PER_PAGE = 10;
  const skip = (page - 1) * PER_PAGE;
  return this.aggregate([
    {
      $match: {
        type,
        user_id: ObjectId(user_id),
      },
    },
    {
      $sort: {
        trusted: -1,
        picks_sent: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: PER_PAGE,
    },
    {
      $project: {
        title: 1,
        is_public: 1,
        is_preset: 1,
        hit_rate: 1,
        trusted: 1,
        active: 1,
      },
    },
  ]);
};

Strategy.findActiveByAdmin = function (type, user_id, page = 1, perPage = 10) {
  user_id = ObjectId(user_id);
  page = Math.max(Number(page), 0);
  const PER_PAGE = 100;
  const skip = (page - 1) * PER_PAGE;

  return this.aggregate([
    {
      $match: {
        is_preset: {$in: [true, 1]},
        ...(type ? {type} : {}),
      },
    },
    {
      $sort: {
        trusted: -1,
        picks_sent: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: perPage,
    },
    {
      $project: {
        id: 1,
        title: 1,
      },
    },
  ]);
};

Strategy.getUserStrategies = function (user_id, limit = 4) {
  user_id = ObjectId(user_id);
  return this.aggregate([
    {
      $match: {
        user_id,
      },
    },
    {
      $sort: {
        picks_sent: -1,
      },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        ...strategy_public_fields,
      },
    },
  ]);
};

Strategy.getOtherStrategies = function (user_id, limit = 4) {
  return this.aggregate([
    {
      $match: {
        user_id: {$ne: ObjectId(user_id)},
        is_public: true,
        picks_sent: {$gt: 10},
        preset_id: null,
      },
    },
    {
      $sort: {
        strike_rate: -1,
      },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        ...strategy_public_fields,
      },
    },
  ]);
};

Strategy.trust = function (_id, user_id) {
  return this.findOneAndUpdate(
    {
      _id,
      user_id: ObjectId(user_id),
    },
    {
      $set: {
        trusted: true,
      },
    },
    {
      new: true,
    }
  );
};

Strategy.untrust = function (_id, user_id) {
  user_id = ObjectId(user_id);
  return this.findOneAndUpdate(
    {
      _id,
      user_id,
    },
    {
      $set: {
        trusted: false,
      },
    },
    {
      new: true,
    }
  );
};

Strategy.updateLeagues = function (_id, user_id, leagues) {
  return this.findOneAndUpdate(
    {
      _id,
      user_id: ObjectId(user_id),
    },
    {
      $set: {
        leagues,
      },
    },
    {
      new: true,
    }
  );
};

Strategy.excludeLeague = function (_id, user_id, league_id) {
  return this.findOneAndUpdate(
    {
      _id,
      user_id: ObjectId(user_id),
    },
    {
      $pull: {
        leagues: league_id,
      },
    },
    {
      new: true,
    }
  );
};

Strategy.togglePresetByAdmin = async function (id) {
  return this.findByIdAndUpdate(
    id,
    [{$set: {is_preset: {$eq: [false, '$is_preset']}}}],
    {
      new: true,
    }
  );
};

Strategy.togglePublicByAdmin = async function (id) {
  return this.findByIdAndUpdate(
    id,
    [{$set: {is_public: {$eq: [false, '$is_public']}}}],
    {
      new: true,
    }
  );
};

Strategy.toggleMute = function (_id, user_id) {
  user_id = ObjectId(user_id);
  return this.findOneAndUpdate(
    {_id, user_id},
    [{$set: {muted: {$eq: [false, '$muted']}}}],
    {
      new: true,
    }
  );
};

Strategy.toggleStatus = function (_id, user_id) {
  user_id = ObjectId(user_id);
  _id = ObjectId(_id);
  return this.findOneAndUpdate(
    {_id, user_id},
    [{$set: {'sale_detail.status': {$eq: [false, '$sale_detail.status']}}}],
    {
      new: true,
    }
  );
};

Strategy.toggle = async function (_id, user_id) {
  user_id = ObjectId(user_id);
  await Pick.cancelAlerts(_id, user_id);

  const strategy = await this.findOneAndUpdate(
    {_id, user_id},
    [{$set: {active: {$eq: [false, '$active']}}}],
    {
      new: true,
    }
  );
  if (strategy.type == 'pre-match' && strategy.active) {
    await Strategy.reschedule(strategy._id);
  }
};

Strategy.deleteByStrategyId = async function (strategy_id, user_id) {
  user_id = ObjectId(user_id);
  await Pick.deleteAlerts(strategy_id, user_id);
  await this.findOneAndDelete({
    _id: strategy_id,
    user_id,
  });
};

Strategy.findAllPreset = function (type) {
  return this.find({
    is_preset: {$in: [true, 1]},
    active: {$in: [true, 1]},
    type,
  });
};

Strategy.findAllInPlay = function (type) {
  return this.find({
    is_preset: true,
    active: true,
    type,
  });
};

Strategy.findPresetById = function (id) {
  return this.find({
    is_preset: true,
    active: true,
    id,
  });
};

Strategy.search = function (search_text, type) {
  const PER_PAGE = 10;
  const startOfDay = moment().startOf('day').unix();
  const endOfDay = moment().add(1, 'days').unix();
  const matchQuery = {
    $text: {
      $search: search_text,
    },
  };
  if (type == 'upcoming') {
    Object.assign(matchQuery, {
      status: {$nin: ['FT', 'FT_PEN']},
      timestamp: {$gte: startOfDay},
    });
  } else {
    Object.assign(matchQuery, {
      status: {$in: ['FT', 'FT_PEN']},
      timestamp: {$lte: endOfDay},
    });
  }
  return this.aggregate([
    {
      $match: matchQuery,
    },
    {
      $sort: {
        timestamp: type == 'upcoming' ? 1 : -1,
      },
    },
    {
      $limit: PER_PAGE,
    },
    {
      $project: {
        fixture_name: 1,
        league_name: 1,
        timestamp: 1,
        fixture_id: 1,
        iso: 1,
        country_name: 1,
        ft_score: '$result.ft_score',
      },
    },
  ]);
};

// Strategy.updateUser = function (changeEvent) {
//   const fullDocument = changeEvent.fullDocument;
//   const {id: user_id} = fullDocument;
//   delete fullDocument.password;
//   const strategies = context.services
//     .get('mongodb-atlas')
//     .db('footyamigo')
//     .collection('strategies');
//   return strategies.updateMany({user_id}, {$set: {user: fullDocument}});
// };

Strategy.findHits = async function (_id, user_id) {
  const strategy = await Strategy.findOne(
    {_id, user_id},
    {_id: 1, league_hit_rates: 1}
  );
  if (!strategy) {
    throw new Error('Strategy not found');
  }
  return strategy.league_hit_rates;
};

Strategy.sellStrategy = async function (
  user_id,
  {strategy_id, is_rules_hidden, note, price, title, type, status}
) {
  try {
    status = !!status;
    const strategy = await this.findOneAndUpdate(
      {
        _id: strategy_id,
        user_id,
        type,
        is_for_sale: {$ne: true},
        is_from_market: {$ne: true},
      },
      [
        {
          $set: {
            is_for_sale: true,
            sale_detail: {
              seller_id: user_id,
              price,
              title,
              note,
              is_rules_hidden,
              status,
            },
          },
        },
      ],
      {
        new: true,
      }
    );
    return strategy;
  } catch (err) {
    console.log(err);
    return false;
  }
};

Strategy.findByIdWithProjection = async function (_id, projection) {
  const id = ObjectId(_id);
  try {
    return await this.findById(id, projection);
  } catch (error) {
    console.log(error);
    return false;
  }
};

// pull and delete null startegy_inplay_rules
// async function deteleEmpty(_id) {
//   return Strategy.findOneAndUpdate(
//     {
//       _id,
//     },
//     {
//       $pull: {
//         strategy_inplay_rules: null,
//       },
//     },
//     {
//       new: true,
//     }
//   );
// }
// async function deteleAllEmpty() {
//   return Strategy.updateMany(
//     {},
//     {
//       $pull: {
//         strategy_inplay_rules: null,
//       },
//     },
//     {
//       new: true,
//     }
//   );
// }
// deteleAllEmpty().then((x) => console.log(x, 'pulled'));

module.exports = Strategy;
