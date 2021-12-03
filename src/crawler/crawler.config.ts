import { URL } from 'url';

const targetBase = 'https://unsplash.com/s/photos/';
const targetQuery = 'cake';
const targetUrl = new URL(String(targetBase + targetQuery));

export { targetUrl, targetBase, targetQuery };
