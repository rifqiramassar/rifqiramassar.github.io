var dbPromised = idb.open("football", 1, function (upgradeDb) {
  var competitionsObjectStore = upgradeDb.createObjectStore("competitions", {
    keyPath: "competition.id",
  });
  //   competitionsObjectStore.createIndex("name", "name", {
  //     unique: false,
  //   });
});

function saveForLater(standings) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("competitions", "readwrite");
      var store = tx.objectStore("competitions");
      console.log(standings);
      store.put(standings);
      return tx.complete;
    })
    .then(function () {
      console.log("Artikel berhasil di simpan.");
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("competitions", "readonly");
        var store = tx.objectStore("competitions");
        return store.getAll();
      })
      .then(function (standings) {
        resolve(standings);
      });
  });
}

function getById(id) {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("competitions", "readonly");
        var store = tx.objectStore("competitions");
        return store.get(Number(id));
      })
      .then(function (standing) {
        resolve(standing);
      });
  });
}

function deleteById(id) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("competitions", "readwrite");
      var store = tx.objectStore("competitions");
      store.delete(id);
      return tx.complete;
    })
    .then(function () {
      console.log("Item deleted");
      getSavedStandings();
    });
}