require('module-alias/register');
const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const mongoUrl = process.env.MONGO_URL;

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: mongoUrl,
  collection: 'sessions',
});

app.set('trust proxy', 1); // trust first proxy

app.use(function (req, res, done) {
  const isHealthcheck = req.url.indexOf('healthcheck') > -1;
  session({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    resave: true,
    store: isHealthcheck || store,
    saveUninitialized: true,
    cookie: {secure: true},
  })(req, res, done);
});

app.disable('x-powered-by');

/**
 * Adds raw body parser to the app, require for stripe webhooks.
 * @param {object} req Request object.
 * @param {object} res Response object.
 * @param {object} buf Buffer object.
 * @param {string} encoding encoding
 */
function verifyRequest(req, res, buf, encoding) {
  req.rawBody = buf.toString(encoding);
}
app.use(
  express.json({
    limit: '32mb',
    verify: verifyRequest,
  })
);
app.use(cookieParser());

app.use(express.urlencoded({extended: true, verify: verifyRequest}));
app.use(cors());

const compression = require('compression');

app.use(compression());

// app.use('/', require('./backend'));

require('./db');

app.use('/webhooks', require('./webhooks'));
app.use('/api', require('./routes'));

module.exports = app;
