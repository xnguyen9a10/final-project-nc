const router = require('express').Router();
const bankLink = require('./bankLink');
const user = require('./user');
const customer = require('./customer');
const employee=require('./employee')
const jwt = require("jsonwebtoken");

  
function requireLogin(req, res, next) {
  let accessToken = req.header("Authorization");
  if ( accessToken && accessToken.startsWith("Bearer ")) {
    // Remove Bearer from string
    accessToken = accessToken.slice(7, accessToken.length);
  }

  jwt.verify(accessToken, "somethingyoudontknow", (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }
    req.user = decoded.user;
    req.authenticated = true;
    return next();
  });
}

router.use('/', user);
router.use(requireLogin);
router.use('/', bankLink);
router.use('/', employee);

module.exports = router;
