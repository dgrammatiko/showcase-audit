const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { writeFileSync } = require('fs');

const url = 'https://showcase.joomla.org/browse-sites/newest-first.html';
const siteLinks = [];
const pagination = 27

async function parseLinks(html) {
  const $ = cheerio.load(html);
  const cards = $('#system .cck_page_items .cck-sites ul.row-fluid li');

  cards.each(function () {
    const href = $(this).find('a').attr('href')
    console.dir(href)
    siteLinks.push(href);
  });
}

(async function() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < (pagination-1); i ++) {
    await page.goto(`${url}?start=${i * 30}`, { waitUntil: "load" });
    const html = await page.content();
    await parseLinks(html);
  }

  await browser.close();

  writeFileSync(process.cwd() + '/sites.json', `${JSON.stringify(siteLinks)}`, {encoding: 'utf-8'})
})();
