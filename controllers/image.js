const handleImage = (req, res, pgDB) => {
  const { id } = req.body;
  pgDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json(`unable to get rank, ${err}`));
};

module.exports = handleImage;
