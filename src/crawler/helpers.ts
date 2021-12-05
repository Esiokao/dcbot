import * as fs from 'fs';
import path from 'path';
import axios from 'axios';
import targetBaseUrl from './crawler.config';

const crawledImage = new Map();
/**
 * @param  {string} imageUrl
 * @returns string
 * @description get the image src id
 */
function getImageName(imageUrl: string): string {
  const imageId = imageUrl
    .substring(imageUrl.indexOf(targetBaseUrl.host), imageUrl.indexOf('?'))
    .replace(targetBaseUrl.host, '');
  return imageId;
}
/**
 * @param  {string} imageUrl
 * @returns boolean
 * @description check if there's duplicate image src path.
 */
export function imageUrlFilter(imageUrl: string): boolean {
  if (!imageUrl) return false;
  let existed = false;
  const imageId = getImageName(imageUrl);
  if (!crawledImage.has(imageId)) {
    crawledImage.set(imageId, true);
  } else {
    existed = true;
  }
  return (
    imageUrl.includes(targetBaseUrl.hostname) &&
    imageUrl.includes('photo') &&
    imageUrl.includes('w=1000&q=80') &&
    !existed
  );
}
/**
 * @param  {string} link
 * @description deprecated, images from unsplash has complete src.
 * @deprecated
 */
export function getUrl(link: string) {
  if (!link.includes('http')) {
    if (link.startsWith('./')) return `${targetBaseUrl}${link.substr(2)}`;
    if (link.startsWith('/')) return `${targetBaseUrl}${link.substr(1)}`;
    return `${targetBaseUrl}${link}`;
  }
  return link;
}
/**
 * @param  {string} dir
 * @returns Boolean
 * @description check if the dir existed or not.
 */
export function dirExistHelper(dir: string): Boolean {
  return fs.existsSync(path.join(__dirname, `../../images/${dir}`));
}
/**
 * @param  {string} dir
 * @description create the folder.
 */
export async function mkdirHelper(dir: string): Promise<void> {
  await fs.promises.mkdir(path.join(__dirname, `../../images/${dir}`));
}

export async function writeFileHelper(type: string, length: number) {
  await fs.promises
    .writeFile(
      path.join(__dirname, `../../images/${type}/config.json`),
      await JSON.stringify({ length })
    )
    .catch(err => console.log(err));
}

export async function downloadImageHelper(filtedImageUrls: Array<string>, type: string) {
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
        writeFileHelper(type, filtedImageUrls.length);
        console.log('done crawling');
      }
    })
  );
}
