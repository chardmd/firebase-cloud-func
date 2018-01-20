const firestore = require("../lib/firebase-lib").firestore();

function get(req, res) {
  const id = req.params.id;
  const getDoc = firestore
    .collection("rent")
    .doc(id)
    .get();

  getDoc
    .then(snapshot => {
      const document = snapshot.data();
      const doc = {
        id: snapshot.id,
        title: document.title,
        price: document.price,
        date: document.date,
        city: document.city,
        station: document.station,
        description: document.description,
        images: document.images,
        createdat: document.createdat
      };
      res.status(200).send(doc);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({ message: "Internal Error" });
    });
}
module.exports = get;
