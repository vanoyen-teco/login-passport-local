const passport = require('passport');
const local = require('passport-local');
const users = require('./User');

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    console.log(user);
                    if (user) return done(null, false)
                    const newUser = {
                        username,
                        password,
                        email: req.body.email,
                    }
                    try {
                        let result = await users.create(newUser)
                        console.log(result);
                        return done(null, result)
                    } catch(err) {
                        // console.log(err)
                        done(err)
                    }
                } catch(err) {
                    // console.log(err)
                    done(err)
                }
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    if (!user) return done(null, false);
                    const comp = user.comparePassword(password, user.password);
                    if(comp){
                        return done(null, user);                        
                    }else{
                        return done(null, false);
                    }
                } catch(err) {
                    done(err)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        users.findById(id, done)
    })
}

module.exports = {
    initializePassport,
}