import { render, html } from "uhtml";

const lazyload = (element) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        element.src = element.getAttribute("data-src");
        observer.disconnect();
      }
    });
  });

  io.observe(element);
};

const renderCard = (item, i) => {
  const url = `Screenshot of ${new URL(item.href).hostname
    .replace("www.", "")
    .replace(/\//, " ")}`;
  const src =
    item.metrics.performance === 0
      ? ""
      : `/images/thumbs/${new URL(item.href).hostname.replace("www.", "")}.jpg`;
  return html` <li class="card" .dataset=${{ i: i }}>
    <div class="card-header">
      <a href="${item.href}"><h3>${item.title}</h3></a>
    </div>
    <div class="card-body">
      <div class="card-image">
        <img loading="lazy" .dataset=${{ src: src }} alt=${url} />
      </div>
      <div class="card-details">
        <ul>
          <li>
            Performace: <span>${Math.round(item.metrics.performance)}%</span>
          </li>
          <li>
            First contentful paint:
            <span>${item.metrics.firstContentfulPaint.toFixed(2)}Sec </span>
          </li>
          <li>
            Best practices:
            <span>${Math.round(item.metrics.bestPractices)}%</span>
          </li>
          <li>
            Accessibility:
            <span>${Math.round(item.metrics.accessibility)}%</span>
          </li>
          <li>SEO: <span>${Math.round(item.metrics.seo)}%</span></li>
          <li>
            carbon footprint: <span>${item.metrics.carbon.toFixed(3)}</span>
          </li>
        </ul>
        <details>
          <summary>Description</summary>
          <p>${item.text}</p>
        </details>
      </div>
    </div>
  </li>`;
};
fetch("/data/final.json")
  .then((response) => {
    debugger;
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    render(
      document.getElementById("content"),
      html` <blockquote>
          <p>
            <b
              >Data from Joomla's
              <a rel="external" href="https://showcase.joomla.org"
                >Showcase Directory</a
              ></b
            >
          </p>
        </blockquote>
        <ul class="cards">
          ${data.map((item, i) => renderCard(item, i))}
        </ul>`
    );

    const images = [].slice.call(
      document.querySelectorAll('img[loading="lazy"]')
    );
    images.forEach(lazyload);
  })
  .catch((error) => {
    render(
      document.getElementById("content"),
      html`<h1>💩, that wasn't expected</h1>`
    );
    console.log("Request failed", error);
  });
