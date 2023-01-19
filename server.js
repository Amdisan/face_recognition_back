const express = require("express");
const bcrypt = require("bcrypt");
const corse = require("cors");
const knex = require("knex");

const handleRegister = require("./controllers/register");
const handleSignIn = require("./controllers/signIn");
const handleImage = require("./controllers/image");
const handleProfile = require("./controllers/profile");

const pgDB = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    user: "postgres",
    password: "2811Zlata2015",
    database: "face_recognition_db",
  },
});

const app = express();

app.use(express.json());
app.use(corse());

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => handleSignIn(req, res, pgDB, bcrypt));

app.post("/register", (req, res) => handleRegister(req, res, pgDB, bcrypt));

app.get("/profile/:id", (req, res) => handleProfile(req, res, pgDB));

app.put("/image", (req, res) => handleImage(req, res, pgDB));

app.listen(3001, () => {
  console.log("server is runnning on port 3001");
});
