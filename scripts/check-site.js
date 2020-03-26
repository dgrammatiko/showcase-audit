const axios = require('axios');
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const data = readFileSync(resolve(`data/data.json`), {encoding: 'utf-8'})

let sites;
let sitesWithErrors = [];

try {
  sites = JSON.parse(data);
} catch(error) {
  throw Error(error);
}

const process = async function() {
  await sites.forEach(async (site, index) => {
    await axios.get(site.href)
      .catch((error) => {
        if (error.response) {
            sitesWithErrors.push(site.href)
            console.dir(site.href)
            console.log(error.response.status);
            writeFileSync(resolve('data/sites-with-errors.json'), JSON.stringify(sitesWithErrors), {encoding: 'utf-8'})
          }
      });
  });
};

process();

