import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { imageUrlFilter, dirExistHelper, mkdirHelper, writeFileHelper } from './helpers';

const crawledUrl = new Map();

async function downloadImage(filtedImageUrls: Array<string>, type: string) {
  // filtedImageUrls.map(async (imageUrl, index) => {
  //   console.log('start', index);
  //   const dest = fs.createWriteStream(`images/${type}/${index}.jpg`);
  //   const response = await axios.get(imageUrl, {
  //     responseType: 'arraybuffer',
  //   });
  //   console.log('get', index);
  //   const buffer = Buffer.from(response.data, 'base64');
  //   dest.write(buffer);
  //   dest.end();
  //   console.log('done writing', index);

  //   if (index === filtedUrls.length - 1) {
  //     if (!dirExistHelper(type)) return;
  //     writeFileHelper(type, index);
  //     console.log('done crawling');
  //   }
  // });
  await Promise.all(
    filtedImageUrls.map(async (imageUrl, index) => {
      const dest = fs.createWriteStream(`images/${type}/${index}.jpg`);
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      console.log('get', index);
      const buffer = Buffer.from(response.data, 'base64');
      dest.write(buffer);
      dest.end();

      if (index === filtedImageUrls.length - 1) {
        if (!dirExistHelper(type)) return;
        writeFileHelper(type, index);
        console.log('done crawling');
      }
    })
  );
}
async function crawler(url: string, type: string) {
  console.log('crawling', url);
  // 1. check if this url has been crawled
  if (crawledUrl.has(url)) return;
  crawledUrl.set(url, true);
  // 2. crwal the html
  const html = await (await axios.get(url)).data;
  const $ = cheerio.load(html);
  const imageUrls = $('img')
    .map((i, image) => image.attribs.src)
    .get();

  // download the image file and encode with base64
  if (imageUrls.length) {
    if (!dirExistHelper(type)) await mkdirHelper(type);
    const filtedUrls = imageUrls.filter(imageUrl => imageUrlFilter(imageUrl));
    await downloadImage(filtedUrls, type);
  }
  console.log('crawl end');
}

export default crawler;
