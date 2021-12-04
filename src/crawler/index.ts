import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { targetUrl } from './crawler.config';

const crawledUrl = new Map();
const crawledImage = new Map();

function getUrl(link: string) {
  if (!link.includes('http')) {
    if (link.startsWith('./')) return `${targetUrl}${link.substr(2)}`;
    if (link.startsWith('/')) return `${targetUrl}${link.substr(1)}`;
    return `${targetUrl}${link}`;
  }
  return link;
}

function imageUrlFilter(imageUrl: string): boolean {
  if (!imageUrl) return false;
  let existed = false;
  const imageId = imageUrl
    .substring(imageUrl.indexOf(targetUrl.host), imageUrl.indexOf('?'))
    .replace(targetUrl.host, '');
  if (!crawledImage.has(imageId)) {
    crawledImage.set(imageId, true);
  } else {
    existed = true;
  }
  return (
    imageUrl.includes(targetUrl.hostname) &&
    imageUrl.includes('photo') &&
    imageUrl.includes('w=1000&q=80') &&
    !existed
  );
}

function getImageName(imageUrl: string): string {
  const imageId = imageUrl
    .substring(imageUrl.indexOf(targetUrl.host), imageUrl.indexOf('?'))
    .replace(targetUrl.host, '');
  return imageId;
}

async function crawl(url: string) {
  console.log('crawling', url);
  // 1. check if this url has been crawled
  if (crawledUrl.has(url)) return;
  crawledUrl.set(url, true);
  // 2. crwal the html
  const html = await (await axios.get(url)).data;
  const $ = cheerio.load(html);
  const imageUrls = $('img')
    .map((i, image) => getUrl(image.attribs.src))
    .get();

  // download the image file and encode with base64
  if (imageUrls.length) {
    imageUrls
      .filter(imageUrl => imageUrlFilter(imageUrl))
      .forEach(imageUrl => {
        const imageName = getImageName(imageUrl);
        const dest = fs.createWriteStream(`images/${imageName}.jpg`);
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

export default crawl;
