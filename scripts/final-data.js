const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const alldata = JSON.parse(readFileSync(resolve(`data/data.json`), {encoding: 'utf-8'}));
const excludedUrls = JSON.parse(readFileSync(resolve(`data/sites-with-errors.json`), {encoding: 'utf-8'}));

const metricsData = JSON.parse(readFileSync(resolve(`data/lh-data.json`), {encoding: 'utf-8'}));
const metricsError = JSON.parse(readFileSync(resolve(`data/lh-errors.json`), {encoding: 'utf-8'}));
let finalData = [];

// Get the error'd urls
const lightHouseErroredUrls = Object.keys(metricsError);

const getMetrics = function(url) {
    if (lightHouseErroredUrls.includes(url)) {
        return {         
            performance: 0,
            firstContentfulPaint: 0,
            firstMeaningfulPaint: 0,
            firstCPUIdle: 0,
            interactive: 0,
            bestPractices: 0,
            accessibility: 0,
            seo: 0,
            carbon: 0,  
        }
    } else {
        return getMedian(url);
    }
}

const getMedian = (url) => {
    if (metricsData[url] && metricsData[url].length) {
        let performance = 0,
        firstContentfulPaint = 0,
        firstMeaningfulPaint = 0,
        firstCPUIdle = 0,
        interactive = 0,
        bestPractices = 0,
        accessibility = 0,
        seo = 0,
        carbon = 0;

        for (let i = 0; i < metricsData[url].length; i++) {
            performance += parseFloat(metricsData[url][i].performance);
            firstContentfulPaint += parseFloat(metricsData[url][i].firstContentfulPaint);
            firstMeaningfulPaint += parseFloat(metricsData[url][i].firstMeaningfulPaint);
            firstCPUIdle += parseFloat(metricsData[url][i].firstCPUIdle);
            interactive += parseFloat(metricsData[url][i].interactive);
            bestPractices += parseFloat(metricsData[url][i].bestPractices);
            accessibility += parseFloat(metricsData[url][i].accessibility);
            seo += parseFloat(metricsData[url][i].seo);
            carbon += parseFloat(metricsData[url][i].carbon); 
        }

        return {
            performance: performance / metricsData[url].length,
            firstContentfulPaint: firstContentfulPaint / metricsData[url].length,
            firstMeaningfulPaint: firstMeaningfulPaint / metricsData[url].length,
            firstCPUIdle: firstCPUIdle / metricsData[url].length,
            interactive: interactive / metricsData[url].length,
            bestPractices: bestPractices / metricsData[url].length,
            accessibility: accessibility / metricsData[url].length,
            seo: seo / metricsData[url].length,
            carbon: carbon / metricsData[url].length,
        }
     } else {
         return {
            performance: 0,
            firstContentfulPaint: 0,
            firstMeaningfulPaint: 0,
            firstCPUIdle: 0,
            interactive: 0,
            bestPractices: 0,
            accessibility: 0,
            seo: 0,
            carbon: 0, 
         }
     }
};



alldata.forEach(el => {
  if (!excludedUrls.includes(el.href)) {
    finalData.push({
        href: el.href,
        text: el.text,
        title: el.title,
        metrics: getMetrics(el.href)
    })
  } 
});

writeFileSync(resolve('data/final.json'), JSON.stringify(finalData), {encoding: 'utf-8'})
