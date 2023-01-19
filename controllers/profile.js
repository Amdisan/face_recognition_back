const handleProfile = (req, res, pgDB) => {
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
};

module.exports = handleProfile;
