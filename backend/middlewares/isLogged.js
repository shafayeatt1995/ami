const jwt = require('jsonwebtoken');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {next} next
 */
function isLogged(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next();
  jwt.verify(token, process.env.AUTHJWT, function (err, decoded) {
    if (err) return next();
    req.user = decoded;
    res.locals.user = req.user;
    return next();
  });
}
module.exports = isLogged;
