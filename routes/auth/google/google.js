const { Router } = require('express');
const { UserModel } = require('../../../models/userModel');
const passport = require('passport');
const { catchAsync } = require('../../../utils');
let GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = new Router();

const googleAuthenticate = async (accessToken, refreshToken, profile, cb) => {
  if (profile._json.email && profile._json.email_verified) {
    const user = await UserModel.findOne({ email: profile._json.email });
    if (!user) {
      const newUser = new UserModel({
        username: profile._json.email,
        email: profile._json.email
      });
      const registeredUser = await UserModel.register(newUser, '12345');
      return cb(null, registeredUser);
    }
    return cb(null, user);
  }
  cb(new Error(), false);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    googleAuthenticate
  )
);

router.get(
  '/',
  passport.authenticate('google', { scope: ['openid', 'email', 'profile'] })
);

router.get(
  '/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    if (req.user.verified) {
      res.redirect('/');
    } else {
      res.redirect('/users/oauth/finalize');
    }
  }
);

module.exports = router;
