import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { imageUrlFilter, dirExistHelper, mkdirHelper } from './helpers';

const crawledUrl = new Map();

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
    if (!dirExistHelper(type)) mkdirHelper(type);
    imageUrls
      .filter(imageUrl => imageUrlFilter(imageUrl))
      .forEach((imageUrl, index) => {
        const dest = fs.createWriteStream(`images/${type}/${index}.jpg`);
        axios
          .get(imageUrl, {
            responseType: 'arraybuffer',
          })
          .then(response => {
            const buffer = Buffer.from(response.data, 'base64');
            dest.write(buffer);
            dest.end();
          });
      });
  }
}

export default crawler;
