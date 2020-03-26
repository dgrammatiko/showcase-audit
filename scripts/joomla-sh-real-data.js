const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { readFileSync, writeFileSync } = require('fs');

const paginatedData = JSON.parse(readFileSync(process.cwd() + '/sites.json', {encoding: 'utf-8'}));
const data = [];

async function parsePage(html) {
    const $ = cheerio.load(html);

    const href = $('.visit-site').attr('href')
    const title = $('.site-title').text()
    const text = $('.cck_value.cck_value_textarea').text()
    console.dir({
        href: href,
        title: title,
        text: text
    })
    data.push({
        href: href,
        title: title,
        text: text
    });
}

(async function() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (var i = 0; i < paginatedData.length; i++) {
        console.log(`Fetching: https://showcase.joomla.org${paginatedData[i]}`)
        await page.goto(`https://showcase.joomla.org${paginatedData[i]}`, { waitUntil: "load" });
        await page.waitFor(3000);
        const html = await page.content();
        await parsePage(html);
    }

    await browser.close();

    writeFileSync(process.cwd() + '/data.json', `${JSON.stringify(data)}`, {encoding: 'utf-8'})
})();
