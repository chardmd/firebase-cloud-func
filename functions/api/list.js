const firestore = require("../lib/firebase-lib").firestore();

function list(req, res) {
  const offsetId = req.params.offsetId;
  const limit = parseInt(req.params.limit);
  const queryDocuments = getQueryDocuments(offsetId, limit);
  queryDocuments
    .then(snapshots => {
      const list = [];
      snapshots.forEach(snapshot => {
        let doc = snapshot.data();
        list.push({
          id: snapshot.id,
          title: doc.title,
          price: doc.title,
          date: doc.date,
          city: doc.city,
          station: doc.station,
          description: doc.description,
          images: doc.images,
          createdat: doc.createdat
        });
      });
      res.status(200).send(list);
    })
    .catch(e => {
      console.error(e);
      res.status(500).send({ message: "Internal Error" });
    });
}

function getQueryDocuments(offsetId, limit) {
  let queryDocuments = null;
  const ALL_ITEMS_ID = "all";
  if (offsetId == ALL_ITEMS_ID) {
    queryDocuments = firestore
      .collection("rent")
      .orderBy("createdat", "desc")
      .limit(limit)
      .get();
  } else {
    queryDocuments = firestore
      .collection("rent")
      .doc(offsetId)
      .get()
      .then(snapshot => {
        const lastItem = snapshot.data();
        return firestore
          .collection("rent")
          .limit(limit)
          .orderBy("createdat", "desc")
          .startAfter(lastItem.createdat)
          .get();
      })
      .catch(e => {
        console.error(e);
      });
  }
  return queryDocuments;
}

module.exports = list;
