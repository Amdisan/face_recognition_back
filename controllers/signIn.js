const handleSignIn = (req, res, pgDB, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }

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
};

export default handleSignIn;
