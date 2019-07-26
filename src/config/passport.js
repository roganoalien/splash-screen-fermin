const passport = require('passport');

const User = require('../models/model-admin');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {
            const user = await User.findOne({ email });
        }
    )
);
