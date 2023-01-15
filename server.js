const express = require("express");
const bcrypt = require("bcrypt");
const corse = require("cors");

const app = express();

app.use(express.json());
app.use(corse());

const database = {
  users: [
    {
      id: "123",
      name: "Sasha",
      email: "sasha@gmail.com",
      password: "banana",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Anna",
      email: "anna@gmail.com",
      password: "apples",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  const user = database.users.find(
    (user) =>
      user.email === req.body.email && req.body.password === user.password
    //bcrypt.compareSync(req.body.password, user.password)
  );
  if (user) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const user = database.users.find((user) => user.email === req.body.email);
  if (user) {
    res.json("user already exists");
  } else {
    const { name, email, password } = req.body;
    const saltRounds = 10;
    bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        database.users.push({
          id: "125",
          name: name,
          email: email,
          password: hash,
          entries: 0,
          joined: new Date(),
        });
      })
      .then(() => res.json(database.users.find((user) => user.id === "125")))
      .catch((error) => res.json(error));
  }
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.find((user) => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json("no such user");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const user = database.users.find((user) => user.id === id);
  console.log(user);
  if (user) {
    user.entries++;
    res.json(user.entries);
  } else {
    res.status(400).json("not found");
  }
});

app.listen(3001, () => {
  console.log("server is runnning on port 3001");
});
