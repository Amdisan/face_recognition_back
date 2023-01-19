const handleRegister = (req, res, pgDB, bcrypt) => {
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
};

module.exports = handleRegister;
