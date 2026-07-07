const passport = require("passport");
const { ApiError } = require("../utils/apiError");

const protect = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user)
      return next(new ApiError(401, "Not authenticated — please log in"));
    req.user = user;
    next();
  })(req, res, next);
};

const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) req.user = user;
    next();
  })(req, res, next);
};

module.exports = { protect, optionalAuth };
