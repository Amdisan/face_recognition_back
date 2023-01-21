import clarifyFetch from "../utils/clarify.js";

const handleImage = async (req, res, pgDB) => {
  const { id, imgUrl } = req.body;

  const fetchImgBox = await clarifyFetch(imgUrl);

  const getRank = pgDB("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => entries[0].entries)
    .catch((err) => {
      throw err;
    });

  Promise.all([fetchImgBox, getRank])
    .then((data) => res.json(data))
    .catch((err) =>
      res.status(400).json(`unable to get rank or fetch clarify, ${err}`)
    );
};

export default handleImage;
