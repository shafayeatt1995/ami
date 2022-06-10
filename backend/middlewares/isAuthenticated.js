const jwt = require('jsonwebtoken');
const moment = require('moment');

/**
 *
 * @param {*} body
 * @return {string} token - jwt token
 */
function genToken(body) {
  const token = jwt.sign({user: body}, process.env.AUTHJWT, {
    expiresIn: '30d',
  });
  return token;
}

const isAuthenticated = (req, res, next) => {
  let token = req.headers.token || req.cookies.token || req.query.token;
  // console.log(req.user.email);

  if (!token) return res.status(401).send('Unauthorised');
  jwt.verify(token, process.env.AUTHJWT, function (err, decoded) {
    if (err) {
      return res.status(401).send('Unauthorised');
    }
    const expiry_time = moment(decoded.exp * 1000);
    const duration = moment.duration(expiry_time.diff(moment()));
    const days = duration.asDays();
    console.log(duration.asMinutes(), duration.asDays());
    if (days < 29) {
      // console.log("Refrshing token");
      // refresh_token = genRefreshToken(body);
      token = genToken(decoded.user);
      const domain = process.env.DOMAIN || 'dashboard.footyamigo.com';
      // res.cookie("refresh_token", refresh_token, {
      //   maxAge: 1000 * 60 * 60 * 24,
      //   httpOnly: true,
      //   domain,
      // });
      res.cookie('token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        domain,
      });
    }
    // console.log(decoded, "USER");
    req.user = decoded;
    return next();
  });
};

module.exports = isAuthenticated;
