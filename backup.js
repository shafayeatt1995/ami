const {loadNuxt, build} = require('nuxt');
const express = require('express');

const app = express();
require('dotenv').config();
// require stMonitor agent
// const {stMonitor} = require('sematext-agent-express');

// Start monitoring metrics
// stMonitor.start();
const isDev = process.env.NODE_ENV !== 'production';
const serverport = process.env.PORT || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const mongoose = require('mongoose');

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', (error) => console.log(error));
mongoose.Promise = global.Promise;

if (process.env.DOMAIN == 'macbook.local') {
  mongoose.set('debug', true);
}

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: mongoUrl,
  collection: 'sessions',
});

app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    resave: true,
    store,
    saveUninitialized: true,
    cookie: {secure: true},
  })
);

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

app.use('/', require('./backend'));

/**
 * Starts our web server and initializes our application.
 */
async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start');

  // Render every route with Nuxt.js
  app.use(nuxt.render);

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt);
  }
  // Listen the server
  app.listen(serverport, '0.0.0.0');
  console.log('Server listening on `localhost:' + serverport + '`.');
}

start();
