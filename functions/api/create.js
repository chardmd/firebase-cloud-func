const firestore = require("../lib/firebase-lib").firestore();

function create(req, res) {
  const {
    title,
    price,
    date,
    city,
    station,
    description,
    contact,
    images
  } = req.body;
  const data = {
    title,
    price,
    date,
    city,
    station,
    description,
    contact,
    images,
    createdat: new Date()
  };
  const document = firestore.collection("rent").add(data);
  document
    .then(snapshot => {
      res.status(200).json({ message: "Success", id: snapshot.id });
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({ message: "Internal Error" });
    });
}

module.exports = create;
