var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

// requires the model with Passport-Local Mongoose plugged in
var User = require('./models/user');
// use static authenticate method of model in LocalStrategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// generate JWT token
exports.getToken = function(user) {
  return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

// option used for JwtStrategy
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// done(err, user, info) is callback for jwtPassport
exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    User.findOne({_id: jwt_payload._id}, (err, user) => {
      if (err) {
        return done(err, false);
      }
      else if (user) {
        return done(null, user);
      }
      else {
        return done(null, false);
      }
    });
  }));

// verifies the user.admin flag to continue or generate 403 error
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin)
    return next()
  else {
    err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
};

exports.verifyUser = passport.authenticate('jwt', {session: false});