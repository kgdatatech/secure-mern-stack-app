const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  // callbackURL: "https://yourbusinessdomain.com/api/auth/google/callback" // PRODUCTION
  callbackURL: "https://localhost:5000/api/auth/google/callback" // DEVELOPMENT
},
async (token, tokenSecret, profile, done) => {
  try {
    // console.log('Profile:', profile);
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        name: `${profile.name.givenName} ${profile.name.familyName}`, // Ensure the name field is populated
        isVerified: true  // Automatically verify the user
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    console.error('Error during authentication:', err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    // console.log('Deserialized user:', user);
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});

module.exports = passport;
