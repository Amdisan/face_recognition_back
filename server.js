const express = require("express");
const bcrypt = require("bcrypt");
const corse = require("cors");
const knex = require("knex");

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

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  pgDB("login")
    .select("email", "hash")
    .where("email", "=", email)
    .then((data) => {
      if (bcrypt.compareSync(password, data[0].hash)) {
        return pgDB("users")
          .select("*")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) =>
            res.status(400).json(`Unable to get user, ${err.detail}`)
          );
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json(`Wrong credentials, ${err.detail}`));

  // res.json("success");

  // res.status(400).json("error logging in");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  pgDB
    .transaction((trx) => {
      return trx("login")
        .insert({
          email,
          hash,
        })
        .returning("email")
        .then((loginEmail) => {
          return trx("users")
            .insert({
              email: loginEmail[0].email,
              name,
              joined: new Date(),
            })
            .returning("*")
            .then((user) => {
              res.json(user[0]);
            });
        });
    })
    .catch((err) => {
      res.status(404).json(`Unable to register, ${err.detail}`);
    });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  pgDB("users")
    .select("*")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("no such user");
      }
    })
    .catch((err) => res.status(400).json(`error getting user, ${err}`));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  pgDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json(`unable to get rank, ${err}`));
});

app.listen(3001, () => {
  console.log("server is runnning on port 3001");
});
