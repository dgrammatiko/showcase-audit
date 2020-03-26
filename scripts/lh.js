const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const RUNS = 3;
const lightHouseData = {};
const lightHouseErrors = {};

async function runLighthouse(urls, numberOfRuns = RUNS) {
  let opts = {
    // onlyCategories: ["performance"]
  };
  let config = null;

  console.log( `Testing ${urls.length} sites:` );

  // SpeedIndex was much lower on repeat runs if we don’t
  // kill the chrome instance between runs of the same site
  for(let j = 0; j < numberOfRuns; j++) {
    let count = 0;
    let chrome = await chromeLauncher.launch({chromeFlags: opts.chromeFlags});
    opts.port = chrome.port;

    for(let url of urls) {
      console.log( `(Site ${++count} of ${urls.length}, run ${j+1} of ${numberOfRuns}): ${url}` );
      try {
        let rawResult = await lighthouse(url, opts, config).then(results => results.lhr);
        if (!lightHouseData[`${url}`]) {
          lightHouseData[`${url}`] = [];
        }

        carbonVal = rawResult.audits['resource-summary'].details.items[0].size / 1024 / 1024 / 1024 * 0.06 * 1000;

        lightHouseData[`${url}`].push({
          performance: Math.ceil(rawResult.categories.performance.score * 100),
          firstContentfulPaint: Math.ceil(rawResult.audits.metrics.details.items[0].firstContentfulPaint / 100) / 10,
          firstMeaningfulPaint: Math.ceil(rawResult.audits.metrics.details.items[0].firstMeaningfulPaint / 100) / 10,
          firstCPUIdle: Math.ceil(rawResult.audits.metrics.details.items[0].firstCPUIdle / 100) / 10,
          interactive: Math.ceil(rawResult.audits.metrics.details.items[0].interactive / 100) / 10,
          bestPractices: Math.ceil(rawResult.categories['best-practices'].score * 100),
          accessibility: Math.ceil(rawResult.categories.accessibility.score * 100),
          seo: Math.ceil(rawResult.categories.seo.score * 100),
          carbon: carbonVal.toFixed(3),
        });
        writeFileSync(resolve('data/lh-data.json'), JSON.stringify(lightHouseData), {encoding: 'utf-8'})

      } catch(e) {
        if (!lightHouseErrors[`${url}`]) {
          lightHouseErrors[`${url}`] = [];
        }
        lightHouseErrors[`${url}`].push(e)
        writeFileSync(resolve('data/lh-errors.json'), JSON.stringify(lightHouseErrors), {encoding: 'utf-8'})
      }

    }

    await chrome.kill();
  }
}

// module.exports = runLighthouse;


const alldata = JSON.parse(readFileSync(resolve(`data/data.json`), {encoding: 'utf-8'}))
const excludedUrls = JSON.parse(readFileSync(resolve(`data/sites-with-errors.json`), {encoding: 'utf-8'}))
let urls = [];

alldata.forEach(el => {
  if (!excludedUrls.includes(el.href)) {
    urls.push(el.href)
  } 
});

runLighthouse(urls, 3)