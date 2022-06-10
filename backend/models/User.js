const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const moment = require('moment');
const {sendTemplateEmail} = require('@backend/mailers');
const {sendySubscribe, sendyUnsubscribe} = require('@backend/mailers/sendy');
const Transaction = require('./Transaction');
const League = require('./League');
const Plan = require('./Plan');
const {ObjectId} = require('mongodb');

const SubscriptionSchema = new Schema(
  {
    name: {type: String},
    price: {type: String},
    days: {type: String},
    trial: {type: Boolean, default: true},
    email: {type: String, lowercase: true},
    // plan_id: { type: Number },
    // order_id: { type: Number },
    subscription_id: {type: String, index: true},
    start_date: {type: Date},
    end_date: {type: Date, index: true, required: false},
    status: {type: String, index: true},
    update_url: {type: String},
    cancel_url: {type: String},
    gateway: {type: String},
    platform_user_id: {type: String},
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const SellerDetailSchema = new Schema(
  {
    fullname: {type: String},
    username: {type: String},
    description: {type: String},
    location: {type: String, default: 'EN'}, // calculated from the IP address when the user sign up.
    language: {type: String, default: 'EN(UK)'},
    total_earnings: {type: Number, default: 0.0},
    total_sales: {type: Number, default: 0},
    total_subscribers: {type: Number, default: 0},
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

const UserSchema = new Schema(
  {
    // id: { type: Number, unique: true },
    subscription: SubscriptionSchema,
    email: {type: String, unique: true, index: true, lowercase: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    utcoffset: {type: Number},
    locale: {type: String, default: 'en'},
    avatar_id: {type: Number, default: 0},
    // id: { type: Number, index: true },
    power: {type: Number, default: 1},
    seen_intro: {type: Boolean, default: false},
    phone: {type: String, index: true},
    leagues_pre_match: Array,
    leagues_in_play: Array,
    favorite_fixtures: Array,

    is_seller: {type: Boolean, default: false},
    seller_detail: SellerDetailSchema,
    favorite_strategies_on_market: [{type: ObjectId, ref: 'Strategy'}],
  },
  {
    strict: false,
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
  }
);

UserSchema.pre('save', function (next) {
  // eslint-disable-next-line no-invalid-this
  const user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  user.password = bcrypt.hashSync(user.password, 10);
  next();
});

const User = mongoose.model('User', UserSchema);

User.prototype.isValidPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

User.findAppUsers = async function (role) {
  const matchQuery = {phone: {$ne: null, $exists: true}};
  switch (role) {
    case 'pro':
      Object.assign(matchQuery, {
        'subscription.plan_id': 1,
      });
      break;
    case 'trial':
      Object.assign(matchQuery, {
        'subscription.plan_id': 2,
      });

      break;
    case 'free':
      Object.assign(matchQuery, {
        'subscription.plan_id': null,
      });
      break;
    default:
      break;
  }
  const users = await this.aggregate([
    {
      $match: matchQuery,
    },
    {
      $project: {
        phone: 1,
        firstname: 1,
      },
    },
  ]);
  return users;
};

User.findByEmail = function (email) {
  return this.findOne({
    email,
  });
};

// User.syncAllUsers().then((x) => console.log(x));
User.updateProfile = async function (
  user_id,
  {firstname, lastname, avatar_id}
) {
  return this.findByIdAndUpdate(user_id, {firstname, lastname, avatar_id});
};

User.changePassword = function (email, old_password, password) {
  // const password = bcrypt.hashSync(new_password, 10);
  const hashed_password = bcrypt.hashSync(password, 10);
  return this.findOneAndUpdate(
    {email, password: old_password},
    {password: hashed_password}
  );
};

User.updatePassword = function (user_id, password) {
  const hashed_password = bcrypt.hashSync(password, 10);
  return this.findByIdAndUpdate(user_id, {password: hashed_password});
};

User.hideIntroForever = function (user_id) {
  return this.findByIdAndUpdate(user_id, {seen_intro: true});
};

User.signup = async function (user_data) {
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    const plan = await Plan.findOne({id: 2}).lean();
    const subscription = {
      plan_id: plan.id,
      email: user_data.email,
      start_date: moment().toDate(),
      end_date: moment().add(plan.days, 'days').toDate(),
      status: 'active',
      ...plan,
    };
    const user = (
      await User.create([{...user_data, subscription}], {
        session,
      })
    )[0];

    if (process.env.domain == 'dashboard.footyamigo.com') {
      await sendySubscribe({
        email: user.email,
        name: user.firstname,
        list: process.env.SENDY_7_DAY_LIST_ID,
      });
      await sendySubscribe({
        email: user.email,
        name: user.firstname,
        list: process.env.SENDY_8_DAY_LIST_ID,
      });
      await sendTemplateEmail({
        receiverEmail: user.email,
        Template: 'WELCOME',
        TemplateData: {name: user.firstname},
      });
    }
  });
};

User.findForAdmin = async function (role) {
  const matchQuery = {};
  switch (role) {
    case 'pro':
      Object.assign(matchQuery, {
        'subscription.plan_id': 1,
        'subscription.end_date': {$gte: new Date()},
      });
      break;
    case 'trial':
      Object.assign(matchQuery, {
        'subscription.plan_id': 2,
        'subscription.end_date': {$gte: new Date()},
      });
      break;
    case 'free':
      Object.assign(matchQuery, {
        $or: [
          {'subscription.plan_id': null},
          {'subscription.end_date': {$lte: new Date()}},
        ],
      });
      break;
    default:
      break;
  }
  const users = await this.find(matchQuery, {
    id: 1,
    email: 1,
    firstname: 1,
    lastname: 1,
    phone: 1,
    subscription: 1,
    created_at: 1,
    updated_at: 1,
  }).sort({
    created_at: -1,
  });
  return users.map((user) => {
    if (user.subscription && user.subscription.end_date < new Date()) {
      user.subscription = null;
    }
    return user;
  });
};

User.issueSubByAdmin = async function ({
  email,
  plan_id,
  order_id,
  start_date,
  end_date,
  subscription_id,
}) {
  const Plan = require('./Plan');
  const plan = await Plan.findOne({id: Number(plan_id)}).lean();
  const user = await User.findOneAndUpdate(
    {email},
    {
      subscription: {
        plan_id: plan.id,
        email,
        order_id,
        subscription_id,
        start_date: start_date || moment().toDate(),
        end_date: end_date
          ? moment(end_date).endOf('day').subtract(1, 'minute').toDate()
          : moment().add(plan.days, 'days').toDate(),
        status: 'active',
        ...plan,
      },
    },
    {new: true}
  );
  if (order_id) {
    await Transaction.findOneAndUpdate({order_id}, {status: 'success'});
  }
  if (!plan.trial) {
    await sendySubscribe({
      email: user.email,
      name: user.firstname,
      list: process.env.SENDY_PRO_LIST_ID,
    });
    await sendyUnsubscribe({
      email: user.email,
      list: process.env.SENDY_8_DAY_LIST_ID,
    });
  }
};

User.updateExpiryByAdmin = function ({email, end_date}) {
  end_date = moment.utc(end_date).toDate();
  return this.findOneAndUpdate({email}, {'subscription.end_date': end_date});
};

User.deleteSubByAdmin = function ({email}) {
  return this.findOneAndUpdate({email}, {subscription: null});
};

User.updateSubscription = function (order_id, data) {
  return this.updateOne({order_id}, data);
};

// User.updateMany({}, { $unset: { telegram: 1 } }).then((x) => console.log(x));
// User.findOne({ id: 21 }, { _id: 1 }).then(async (user) => {
//   const Strategy = require("./Strategy");
//   await Strategy.updateMany({ user_id: 21 }, { _user_id: user._id });
// });

// User.find({}, { _id: 1, id: 1 })
//   .lean()
//   .then((users) => {
//     //savehmap to json
//     const json = JSON.stringify(users);
//     //write to file
//     const fs = require("fs");
//     fs.writeFile("./users_hmap.json", json, (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//   });

// find duplicate emails
// User.find({ email: { $exists: true } }, { _id: 1, email: 1 }).then(
//   async (users) => {
//     const emails = users.map((user) => user.email);
//     const uniqueEmails = [...new Set(emails)];
//     const duplicates = emails.filter((email) =>
//       uniqueEmails.includes(email) ? false : true
//     );
//     console.log(duplicates);
//   }
// );

User.updateLeagues = async function (user_id, strategy_type, leagues) {
  user_id = ObjectId(user_id);
  let user;
  try {
    if (strategy_type === 'pre-match-alerts') {
      user = await this.findByIdAndUpdate(
        user_id,
        {leagues_pre_match: leagues},
        {returnDocument: 'after'}
      );
    } else {
      user = await this.findByIdAndUpdate(
        user_id,
        {leagues_in_play: leagues},
        {returnDocument: 'after'}
      );
    }
    return user;
  } catch (error) {
    console.log(error);
  }
  return false;
};

User.getLeagues = async function (user_id, strategy_type) {
  const user = await this.findById(user_id);
  if (!user.leagues_pre_match || user.leagues_pre_match.length <= 0) {
    // the very first time to get leagues_pre_match, currently [], make it to all leagues
    const all = await League.findAll();
    const all_ids = all.map(({id}) => id);
    user.leagues_pre_match = all_ids;
    await user.save();
  }
  if (!user.leagues_in_play || user.leagues_in_play.length <= 0) {
    // the very first time to get leagues_in_play, currently [], make it to all leagues
    const all = await League.findAll();
    const all_ids = all.map(({id}) => id);
    user.leagues_in_play = all_ids;
    await user.save();
  }
  if (strategy_type === 'pre-match-alerts') {
    return user.leagues_pre_match;
  } else {
    return user.leagues_in_play;
  }
};

User.toggleFavoriteFixture = async function (
  user_id,
  {fixture_id, addOrRemove}
) {
  user_id = ObjectId(user_id);
  let user;
  try {
    if (addOrRemove) {
      // should add
      // check if already exist
      if (await this.findOne({_id: user_id, favorite_fixtures: fixture_id}))
        return;
      user = await this.findByIdAndUpdate(
        user_id,
        {
          $push: {favorite_fixtures: fixture_id},
        },
        {returnDocument: 'after'}
      );
    } else {
      // check if already not exist
      if (await this.findOne({_id: user_id, favorite_fixtures: fixture_id})) {
        user = await this.findByIdAndUpdate(
          user_id,
          {
            $pullAll: {favorite_fixtures: [fixture_id]},
          },
          {returnDocument: 'after'}
        );
      }
    }
    return user;
  } catch (error) {
    console.log(error);
  }
  return false;
};

User.getFavoriteFixtures = async function (user_id) {
  const {favorite_fixtures} = await this.findById(user_id);
  return favorite_fixtures;
};

User.clearFavoriteFixtures = async function (user_id) {
  try {
    const user = await this.findByIdAndUpdate(
      user_id,
      {
        $set: {favorite_fixtures: []},
      },
      {returnDocument: 'after'}
    );
    return user;
  } catch (error) {
    console.log(error);
  }
  return false;
};

User.createSellerProfile = async function (
  user_id,
  {fullname, username, description, countryCode}
) {
  try {
    const cur_user = await this.findById(user_id, {
      is_seller: true,
      'subscription.plan_id': true,
    });
    if (!(cur_user.subscription && cur_user.subscription.plan_id == 1)) {
      console.log('Error: User is not Pro');
      return false;
    }
    if (cur_user.is_seller) {
      console.log('Error: user is alreay seller');
      return false;
    }
    const user = await this.findByIdAndUpdate(
      user_id,
      {
        is_seller: true,
        seller_detail: {fullname, username, description, location: countryCode},
      },
      {returnDocument: 'after'}
    );
    return user;
  } catch (error) {
    console.log(error);
  }
  return false;
};

User.updateSellerProfile = async function (
  user_id,
  {fullname, username, description}
) {
  try {
    const cur_user = await this.findById(user_id, {is_seller: true});
    if (!cur_user.is_seller) {
      console.log('Error: User is not seller');
      return false;
    }
    const user = await this.findByIdAndUpdate(
      user_id,
      {
        seller_detail: {fullname, username, description},
      },
      {returnDocument: 'after'}
    );
    return user;
  } catch (error) {
    console.log(error);
  }
  return false;
};

// User.updateMany(
//   {
//     utcoffset: 0,
//   },
//   { utcoffset: 60 }
// ).then((x) => console.log(x));
module.exports = User;
