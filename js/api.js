var base_url = "https://api.football-data.org/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk melakukan request data json
function getCompetitions() {
  // const url = "http://api.football-data.org/v2/competitions/";
  // const API_KEY = "ac24cac5ddb64322bfa4193501fbbf63";
  // const newRequest = function (url) {
  //   return fetch(url, {
  //     headers: {
  //       'X-Auth-Token': API_KEY
  //     }
  //   });
  // };
  const newRequest = new Request(
    "https://api.football-data.org/v2/competitions/", {
      mode: "cors",
      method: "GET",
      headers: {
        "X-Auth-Token": "ac24cac5ddb64322bfa4193501fbbf63",
      },
    }
  );
  if ("caches" in window) {
    caches.match(newRequest).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var competitionsHTML = "";
          data.competitions.forEach(function (competition) {
            competitionsHTML += `
                  <div class="col s12 m6">
                      <div class="card blue-grey darken-1">
                          <div class="card-content white-text">
                              <span class="card-title">${competition.name}</span>
                              <p>Area : ${competition.area.name}</p>
                          </div>
                          <div class="card-action">
                              <a href="./standings.html?id=${competition.id}">Standings</a>
                          </div>
                      </div>
                  </div>
              
              `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("competitions").innerHTML = competitionsHTML;
        });
      }
    });
  }

  fetch(newRequest)
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      var competitionsHTML = "";
      data.competitions.forEach(function (competition) {
        competitionsHTML += `
            <div class="col s12 m6">
                <div class="card blue-grey darken-1">
                    <div class="card-content white-text">
                        <span class="card-title">${competition.name}</span>
                        <p>Area : ${competition.area.name}</p>
                    </div>
                    <div class="card-action">
                        <a href="./standings.html?id=${competition.id}">Standings</a>
                    </div>
                </div>
            </div>
        `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("competitions").innerHTML = competitionsHTML;
    })
    .catch(error);
}

function getStandingsById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    const newRequest = new Request(
      "http://api.football-data.org/v2/competitions/" + idParam + "/standings", {
        mode: "cors",
        method: "GET",
        headers: {
          "X-Auth-Token": "ac24cac5ddb64322bfa4193501fbbf63",
        },
      }
    );
    if ("caches" in window) {
      return fetch(newRequest)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          var standingsHTML = `<h3 style="text-align: center;">${data.competition.name}</h3>
                                <table class="responsive-table">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Name</th>
                                                    <th>Won</th>
                                                    <th>Draw</th>
                                                    <th>Lost</th>
                                                    <th>Point</th>
                                                </tr>
                                            </thead>
                                                <tbody>`;
          let standingSelect = data.standings.find((el) => el.type === "TOTAL");
          standingSelect.table.forEach(function (standing) {
            standingsHTML += `
                    <tr>
                        <td>${standing.position}</td>
                        <td>${standing.team.name}</td>
                        <td>${standing.won}</td>
                        <td>${standing.draw}</td>
                        <td>${standing.lost}</td>
                        <td>${standing.points}</td>
                    </tr>
              `;
          });
          standingsHTML += `</tbody>
          </table>`;
          document.getElementById("body-content").innerHTML = standingsHTML;
          // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
          resolve(data);
        })
        .catch(function (error) {
          var msg = `<p style="text-align: center;">You cannot see paid content </p>`;
          document.getElementById("body-content").innerHTML = msg;
          // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
          reject(data);
        });
    }

    fetch(newRequest)
      .then(status)
      .then(json)
      .then(function (data) {
        // Objek JavaScript dari response.json() masuk lewat variabel data.
        console.log(data);
        // Menyusun komponen card artikel secara dinamis
        var standingsHTML = "";
        let standingSelect = data.standings.find((el) => el.type === "TOTAL");
        standingSelect.table.forEach(function (standing) {
          standingsHTML += `
                    <tr>
                        <td>${standing.position}</td>
                        <td>${standing.team.name}</td>
                        <td>${standing.won}</td>
                        <td>${standing.draw}</td>
                        <td>${standing.lost}</td>
                        <td>${standing.points}</td>
                    </tr>
              `;
        });
        standingsHTML += `</tbody>
          </table>`;

        document.getElementById("body-content").innerHTML = standingsHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      })
      .catch(function (error) {
        var msg = "Anda tidak diperbolehkan melihat";
        document.getElementById("body-content").innerHTML = msg;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        reject(data);
      });
  });
}

function getSavedStandings() {
  getAll().then(function (standings) {
    console.log(standings);
    // Menyusun komponen card artikel secara dinamis
    var standingsHTML = "";
    standings.forEach(function (standing) {
      standingsHTML += `
                <div class="col s12 m6">
                    <div class="card blue-grey darken-1">
                        <div class="card-content white-text">
                            <span class="card-title">${standing.competition.name}</span>
                            <p>Area : ${standing.competition.area.name}</p>
                        </div>
                        <div class="card-action">
                            <a href="./standings.html?id=${standing.competition.id}&saved=true">Standings</a>
                            <a href="#saved" id="btnDelete" onclick="deleteById(${standing.competition.id})">Delete</a>
                        </div>
                    </div>
                </div>
                `;
    });
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("competitions").innerHTML = standingsHTML;
  });
}

function getSavedStandingById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  getById(idParam).then(function (data) {
    console.log(data);
    var standingsHTML = `<h3 style="text-align: center;">${data.competition.name}</h3>
                                <table class="responsive-table">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Name</th>
                                                    <th>Won</th>
                                                    <th>Draw</th>
                                                    <th>Lost</th>
                                                    <th>Point</th>
                                                </tr>
                                            </thead>
                                                <tbody>`;
    let standingSelect = data.standings.find((el) => el.type === "TOTAL");
    standingSelect.table.forEach(function (standing) {
      standingsHTML += `
                    <tr>
                        <td>${standing.position}</td>
                        <td>${standing.team.name}</td>
                        <td>${standing.won}</td>
                        <td>${standing.draw}</td>
                        <td>${standing.lost}</td>
                        <td>${standing.points}</td>
                    </tr>
              `;
    });
    standingsHTML += `</tbody>
          </table>`;
    document.getElementById("body-content").innerHTML = standingsHTML;
  });
}