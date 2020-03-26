const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const alldata = JSON.parse(readFileSync(resolve(`data/final.json`), {encoding: 'utf-8'}));

let sitesNoHttps = 0;
let failing1Sec = 0;
let sitesFailingFCP = 0;
let sitesFailingPerf = 0;
let sitesFailingFMP = 0;
let sitesInteractive = 0;
let sitesBP = 0;
let sitesAccessibility = 0;
let sitesSEO = 0;
let sitesCarbon = 0;
const performance = [];
const firstContentfulPaint = [];
const firstMeaningfulPaint = [];

const average = (arr) => {
    let sum = arr.reduce((previous, current) => current += previous);
    return sum / arr.length;
};

const median = (arr) => {
    arr.sort((a, b) => a - b);
    let lowMiddle = Math.floor((arr.length - 1) / 2);
    let highMiddle = Math.ceil((arr.length - 1) / 2);
    return (arr[lowMiddle] + arr[highMiddle]) / 2;
};

alldata.forEach(site => {
    if (!site.href.startsWith(`http:`)) {
        sitesNoHttps += 1;
    }
    if (site.metrics.performance <= 50) {
        sitesFailingPerf += 1;
    }
    performance.push(site.metrics.performance);

    if (site.metrics.firstContentfulPaint >= 1) {
        failing1Sec += 1;
    }
    if (site.metrics.firstContentfulPaint >= 3) {
        sitesFailingFCP += 1;
    }
    firstContentfulPaint.push(site.metrics.firstContentfulPaint)


    if (site.metrics.firstMeaningfulPaint >= 3) {
        sitesFailingFMP += 1;
    }
    firstMeaningfulPaint.push(site.metrics.firstMeaningfulPaint)

    if (site.metrics.interactive >= 5) {
        sitesInteractive += 1;
    }
    if (site.metrics.bestPractices <= 50) {
        sitesBP += 1;
    }
    if (site.metrics.accessibility <= 50) {
        sitesAccessibility += 1;
    }
    if (site.metrics.seo <= 50) {
        sitesSEO += 1;
    }
    if (site.metrics.carbon >= 0.10) {
        sitesCarbon += 1;
    }

});
const finalData = {
    medianPerformance: median(performance),
    medianFirstContentfulPaint: median(firstContentfulPaint),
    medianFirstMeaningfulPaint: median(firstMeaningfulPaint),
    sitesNoHttps: sitesNoHttps,
    failingPerformance: sitesFailingPerf,
    failingFMP: sitesFailingFMP,
    failing1Sec: failing1Sec,
    failingInteractive: sitesInteractive,
    failingBestPractices: sitesBP,
    failingAccessibility: sitesAccessibility,
    failingSEO: sitesSEO,
    failingCarbon: sitesCarbon,
    // Percentages
    sitesNoHttpspc: (sitesNoHttps / alldata.length) * 100,
    failing1Secpc: (failing1Sec / alldata.length) * 100,
    failingPerformancepc: (sitesFailingPerf / alldata.length) * 100,
    failingFMPpc: (sitesFailingFMP / alldata.length) * 100,
    failingInteractivepc: (sitesInteractive / alldata.length) * 100,
    failingBestPracticespc: (sitesBP / alldata.length) * 100,
    failingAccessibilitypc: (sitesAccessibility / alldata.length) * 100,
    failingSEOpc: (sitesSEO / alldata.length) * 100,
    failingCarbonpc: (sitesCarbon / alldata.length) * 100,
}

writeFileSync(resolve('data/overview.json'), JSON.stringify(finalData, null, 2), {encoding: 'utf-8'})
