const {execSync} = require('child_process');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const {URL} = require('url');

const imagesFolder = 'src_images';
const data = readFileSync(resolve(`data/data.json`), {encoding: 'utf-8'})
let sites;
let sitesWithErrors = [];

try {
  sites = JSON.parse(data);
} catch(error) {
  throw Error(error);
}
(async function() {
  await sites.forEach(async site => {
    const urlCurrent = new URL(site.href);
    const filename = urlCurrent.hostname.replace(`www.`, '');
    if (['dolcevia.com', 'voltaire-joffre.com'].includes(filename)) return;
      if (existsSync(resolve(`${process.cwd()}/${imagesFolder}/${filename}.png`))) {
        console.log(`${filename} skipped`)
        return;
      } else {
        console.log(`${filename} capturing`);
        try {
          execSync(`npx pageres ${site.href} 1500x1125 --crop --delay=5 --filename='${imagesFolder}/${filename}'`);
        } catch(err) {
          sitesWithErrors.push(site.href)
          console.dir(err)
          console.dir(sitesWithErrors)
        }
      }
    });
})()
