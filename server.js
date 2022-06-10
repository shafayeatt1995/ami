const {loadNuxt, build} = require('nuxt');
require('dotenv').config();
const app = require('express')();
const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

/**
 *  Starts the server.
 */
async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start');

  // Render every route with Nuxt
  app.use(nuxt.render);

  // Build only in dev mode with hot-reloading
  if (isDev) {
    await build(nuxt);
  }
  // Listen the server
  app.listen(port, '0.0.0.0');
  console.log('Server listening on `localhost:' + port + '`.');
}

start();
