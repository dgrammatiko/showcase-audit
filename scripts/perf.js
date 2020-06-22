const { readFileSync, writeFileSync } = require("fs-extra");
const { resolve } = require("path");

(async () => {
  const alldata = JSON.parse(
    readFileSync(resolve(`data/final.json`), { encoding: "utf-8" })
  );

  for (const site in alldata) {
    const item = alldata[site];
    const filename = item.title
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/\//g, "-")
      .replace(/\\/g, "-")
      .replace(/\,/g, "-")
      .replace(/\./g, "-")
      .replace(/\#/g, "-")
      .replace(/::/g, "")
      .replace(/@/g, "");
    const url = `Screenshot of ${new URL(item.href).hostname
      .replace("www.", "")
      .replace(/\/$/, " ")}`;
    const src =
      item.metrics.performance === 0
        ? ""
        : `/images/thumbs/${new URL(item.href).hostname.replace(
            "www.",
            ""
          )}.jpg`;

    const data = `---
title: ${filename}
---

<div style="height: 3rem">
  <a href="${item.href}"><h3>${item.title}</h3></a>
</div>
<img loading="lazy" src="${src}" alt="${url}" />
<ul>
  <li>Performace: ${Math.round(item.metrics.performance)}%</li>
  <li>
    First contentful paint:
    ${item.metrics.firstContentfulPaint.toFixed(2)}Sec
  </li>
  <li>Best practices: ${Math.round(item.metrics.bestPractices)}%</li>
  <li>Accessibility: ${Math.round(item.metrics.accessibility)}%</li>
  <li>SEO: ${Math.round(item.metrics.seo)}%</li>
  <li>carbon footprint: ${item.metrics.carbon.toFixed(3)}</li>
</ul>
<details>
  <summary>Description</summary>
  <p>${item.text}</p>
</details>

`;

    writeFileSync(`src_site/test/${filename}.md`, data, {
      encoding: "utf-8",
    });
  }
})();
