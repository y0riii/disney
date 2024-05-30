const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const mongo = require("mongodb")

var url = "mongodb://localhost:27017/auth";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => {
    console.error(error);
});

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: "email" }, (email, password, done) => {
        db.collection("users").findOne({ email: email }).then(async (user) => {
            if (user == null) return done(null, false, { message: "No user with this email." })
            try {
                if (await bcrypt.compare(password, user.password)) {
                    if (user.verified == undefined) return done(null, user)
                    else return done(null, false, { message: "Email is not verified." })
                } else {
                    return done(null, false, { message: "Wrong password." })
                }
            } catch (err) { return done(err) }
        })
    }))
    passport.serializeUser((user, cb) => {
        cb(null, user._id);
    });
    passport.deserializeUser((id, cb) => {
        db.collection("users").findOne({ _id: new mongo.ObjectId(id) }, (err, user) => {
            const userInformation = {
                username: user.username,
            };
            cb(err, userInformation);
        });
    });
}

