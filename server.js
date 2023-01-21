import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";

import { connectConfig, port } from "./utils/init.js";

import handleRegister from "./controllers/register.js";
import handleSignIn from "./controllers/signIn.js";
import handleImage from "./controllers/image.js";
import handleProfile from "./controllers/profile.js";

const pgDB = knex({
  client: "pg",
  connection: connectConfig,
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});

app.post("/signin", (req, res) => handleSignIn(req, res, pgDB, bcrypt));

app.post("/register", (req, res) => handleRegister(req, res, pgDB, bcrypt));

app.get("/profile/:id", (req, res) => handleProfile(req, res, pgDB));

app.post("/image", (req, res) => handleImage(req, res, pgDB));

app.listen(port, () => {
  console.log("server is runnning on port 3001");
});
