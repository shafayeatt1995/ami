const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex:
    process.env.NODE_ENV !== 'production' && process.env.AUTO_INDEX == '1',
});
mongoose.connection.on('error', (error) => console.log(error));
mongoose.Promise = global.Promise;

if (process.env.MONGO_LOGS == '1') {
  mongoose.set('debug', true);
}

const AccountActivationCode = require('./models/AccountActivationCode');
const BetBuilder = require('./models/BetBuilder');
const BettingSystem = require('./models/BettingSystem');
const Bookmaker = require('./models/Bookmaker');
const Broadcast = require('./models/Broadcast');
const Error = require('./models/Error');
const Fixture = require('./models/Fixture');
const League = require('./models/League');
const LocalCountry = require('./models/LocalCountry');
const Market = require('./models/Market');
const Outcome = require('./models/Outcome');
const PageVideo = require('./models/PageVideo');
const Pick = require('./models/Pick');
const Plan = require('./models/Plan');
const Rule = require('./models/Rule');
const Strategy = require('./models/Strategy');
const Streak = require('./models/Streak');
const SubscriptionDetail = require('./models/SubscriptionDetail');
const Transaction = require('./models/Transaction');
const Update = require('./models/Update');
const User = require('./models/User');
const Session = require('./models/Session');
const ValueBet = require('./models/ValueBet');
const ValueBetHistory = require('./models/ValueBetHistory');

module.exports = {
  AccountActivationCode,
  BetBuilder,
  BettingSystem,
  Bookmaker,
  Broadcast,
  Error,
  Fixture,
  League,
  LocalCountry,
  Market,
  Outcome,
  PageVideo,
  Pick,
  Plan,
  Rule,
  Session,
  Strategy,
  Streak,
  SubscriptionDetail,
  Transaction,
  Update,
  User,
  ValueBet,
  ValueBetHistory,
};
