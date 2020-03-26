# showcase-audit

## How to
- Clone the repo
```
git clone git@github.com:dgrammatiko/showcase-audit.git
```

- Do npm install
```
npm install
```

## Get the data
- Get the links from the source
```
node ./scripts/joomla-showcase-scrpper.js
```

- Get the actual data (title/url/desc) for each item. This might take a while
```
node ./scripts/joomla-sh-real-data.js
```

- Check if the sites don't return 404 or network error (no valid SSL cert)
```
node ./scripts/check-site.js
```

- Run Google's Lighthouse. This will take many hours
```
node ./scripts/lh.js
```

- Format the collected output
```
node ./scripts/final-data.js
```

- Get some summary/stats from the formatted output values
```
node ./scripts/final-data-overview.js
```

- Get a screenshot per site. This will take several hours
```
node ./scripts/capture-image.js
```

- Create some thumbs/resized images
```
node ./scripts/process-images.js
```

Well done. You probably lost couple of days to do all this...
