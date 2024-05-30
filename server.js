const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const mongo = require("mongodb");
const randomString = require("randomstring");
const Verifier = require("email-verifier");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const uuid = require("uuid");

var url = "mongodb://localhost:27017/auth";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => {
    console.error(error);
});
db.once("open", () => {
    console.log("Connected to the Database");
});
// db.collection("users").remove();
setTimeout(() => {
    // db.collection("users").find({}).toArray((err, result) => { console.log(result) })
    if (db.collection("users") == undefined) {
        db.createCollection("users");
    }
}, 500);

app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: false }));
app.use(
    cors({
        origin: "http://192.168.1.11:3000", // <-- location of the react app were connecting to
        credentials: true,
    })
);
app.use(
    session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true,
    })
);
let theUser = null
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passport-config")(passport);

app.post("/register", (req, res) => {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var rPassword = req.body.rPassword;
    if (username.length > 12)
        return res.send("Username must be between 4 and 12 characters.");
    if (password.length > 24)
        return res.send("Password must be between 8 and 24 characters.");
    let verifier = new Verifier("at_djd2eADi2X06VUNuc0BovclR4ohTn");
    verifier.verify(email, { hardRefresh: true }, async (error, data) => {
        if (error) return res.send("Invalid email address.");
        if (data.smtpCheck == "false")
            return res.send("Invalid email address.");
        if (username.length < 4)
            return res.send("Username must be at least 4 characters.");
        db.collection("users")
            .findOne({ username: username })
            .then(async (result) => {
                if (result != null) {
                    return res.send("This username is taken.")
                };
                if (password != rPassword) return res.send("Passwords doesn't match.");
                if (password.length < 8)
                    return res.send("Password should contain at least 8 characters.");
                db.collection("users")
                    .findOne({ email: email })
                    .then(async (result) => {
                        if (result != null) return res.send("Email is already registered.");
                        var hashedPassword = await bcrypt.hash(password, 10);
                        db.collection("users").insertOne({
                            id: Date.now().toString() + uuid.v4().toString(),
                            username: username,
                            email: email,
                            password: hashedPassword,
                            watchList: [],
                        });
                        return res.send("toHome");
                    });
            });
    });
});

app.post("/login", (req, res, next) => {
    if (req.body.email.length == 0 || req.body.password.length == 0)
        return res.send("Please fill all the fields.");
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send(info.message);
        else {
            req.logIn(user, (err) => {
                if (err) throw err;
                theUser = user
                res.send("suc");
            });
        }
    })(req, res, next);
});

app.get("/user", (req, res) => {
    if (req.isAuthenticated()) return res.send(req.user);
    res.send("");
});

app.delete("/logout", (req, res) => {
    if (req.isAuthenticated()) {
        req.logOut(() => {
            theUser = null
            res.send("toLogin");
        });
    }
});

app.post("/addWatch", (req, res) => {
    if (!theUser) return
    db.collection("users").findOne({ id: theUser.id }).then(async (result) => {
        let array = result.watchList
        for (let i = 0; i < result.watchList.length; i++) {
            if (result.watchList[i].id == req.body.id.id) {
                array.splice(i, 1)
                await db.collection("users").updateOne(theUser, { $set: { watchList: array } })
                db.collection("users").findOne({ id: theUser.id }).then(result => theUser = result)
                return res.send("removed")
            }
        }
        await db.collection("users").updateOne(theUser, { $push: { watchList: req.body.id } })
        db.collection("users").findOne({ id: theUser.id }).then(result => theUser = result)
        return res.send("added")
    })
})

app.post("/findWatch", (req, res) => {
    db.collection("users").findOne({ id: theUser.id }).then(result => {
        for (let i = 0; i < result.watchList.length; i++) {
            if (result.watchList[i].id == req.body.id) return res.send("found")
        }
        return res.send("not-found")
    })
})

app.get("/watchListGet", (req, res) => {
    return res.send(theUser.watchList)
})

app.listen(4000, () => {
    console.log("Server started on port 4000.");
});
