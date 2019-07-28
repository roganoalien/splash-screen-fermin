const passport = require('passport'),
    LocalStrategy = require('passport-local');

const User = require('../models/model-admin');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: '¡El usuario no existe!' });
            } else {
                const match = await user.matchPassword(password);
                if (match) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: '¡Usuario o password incorrecto!'
                    });
                }
            }
        }
    )
);
// Crea sesión de usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Tome el ID y regresa el usuario
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});
