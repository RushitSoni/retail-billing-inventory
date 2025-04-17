const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Model/User");
const dotenv =require("dotenv")
dotenv.config()

passport.use(

    
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_SERVER_URL}/api/auth/google/callback`,
            passReqToCallback: true, //  Allows access to req object
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const isSignup = req.session.isSignup; //  Check if request is for signup

                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    if (isSignup) {
                        //  User exists but trying to sign up → Throw error
                        return done(null, false);
                    }

                    if(!user.googleId){
                      
                        return done(null, false);
                    }


                    //  User exists & trying to log in → Allow login
                    return done(null, user);
                }

                if (!isSignup) {
                    //  User does NOT exist but trying to log in → Throw error
                    return done(null, false);
                }

                //  New user signing up → Create user
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    isVerified: true,
                });

                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
