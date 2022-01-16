const fs = require('fs');
const axios = require('axios');

axios
  .get('https://andromeda.miragespace.net/slugsurvival/data/fetch/terms/2220.json')
  .then(response => {
    fs.writeFile('scripts/slugshort.json', JSON.stringify(response.data), function (e) {
      if (e) {
        console.log(e);
      }
    });
  })
  .catch(e => console.log(e));

axios
  .get('https://andromeda.miragespace.net/slugsurvival/data/fetch/courses/2220.json')
  .then(response => {
    fs.writeFile('scripts/sluglong.json', JSON.stringify(response.data), function (e) {
      if (e) {
        console.log(e);
      }
    });
  })
  .catch(e => console.log(e));