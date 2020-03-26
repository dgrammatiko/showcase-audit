const { existsSync, writeFileSync } = require('fs');
const { sync } = require('glob');
const sharp = require('sharp');
const { mkdirpSync } = require('fs-extra');

if (!existsSync('images/thumbs')) mkdirpSync('images/thumbs');

sync(`./src_images/*.{jpg,png}`).forEach((file) => {
  console.log('Processing:', file)

  const thumbFile = file.replace(`src_images`, `images/thumbs`).replace('.png', `.jpg`)
  const largeFile = file.replace(`src_images`, `images`).replace('.png', `.jpg`)

  sharp(file)
  .resize({
    width: 560,
    height: 420,
    fit: 'cover',
    position: 'top',
  })
  .jpeg({
    quality: 70,
  })
  .toBuffer()
  .then(data => {
    writeFileSync(largeFile, data);
  })
  .catch(err => {
    console.log(err);
  });

  sharp(file)
  .resize({
    width: 280,
    height: 210,
    fit: 'cover',
    position: 'top',
  })
  .jpeg({
    quality: 60,
  })
  .toBuffer()
  .then(data => {
    writeFileSync(thumbFile, data);
  })
  .catch(err => {
    console.log(err);
  });
})