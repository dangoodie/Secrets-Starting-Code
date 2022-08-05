//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const hash = require("hash.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: hash.sha256().update(req.body.password).digest("hex"),
  });

  newUser.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
      console.log(err);
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = hash.sha256().update(req.body.password).digest("hex");

  User.findOne({ email: username }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("Wrong password");
        }
      } else {
        res.send("No user found");
      }
    } else {
      console.log(err);
      res.send(err);
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
