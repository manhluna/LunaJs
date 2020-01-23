const db = require('../database/model')
module.exports = (passport) => {
    passport.serializeUser(function(user, done) {
        console.log(user)
        done(null, user.id)
    })
    
    passport.deserializeUser(function(id, done) {
        db.user.findById(id, function(err, user) {
            done(err, user)
        })
    })
}