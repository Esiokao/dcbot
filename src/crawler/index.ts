import axios from 'axios';
import cheerio from 'cheerio';
import { imageUrlFilter, dirExistHelper, mkdirHelper, downloadImageHelper } from './helpers';

const crawledUrl = new Map();

async function crawler(url: string, type: string, dir: string) {
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
    if (!dirExistHelper(dir)) await mkdirHelper(dir);
    const filtedUrls = imageUrls.filter(imageUrl => imageUrlFilter(imageUrl));
    await downloadImageHelper(filtedUrls, type, dir);
  }
  console.log('crawl end');
}

export default crawler;
