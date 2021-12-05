import { BufferResolvable } from 'discord.js';
import * as fs from 'fs';
import path from 'path';

export function randMax(max: number) {
  return Math.trunc((1e9 * Math.random()) % max);
}

export async function getImageBufferHelper(type: string): Promise<BufferResolvable> {
  const data = await fs.promises.readFile(
    path.join(__dirname, `../../images/${type}/config.json`),
    {
      encoding: 'utf-8',
    }
  );
  const { length } = JSON.parse(data);
  const imagePath = path.join(__dirname, `../../images/${type}/${randMax(length)}.jpg`);
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer;
}

/**
 * @param  {string} dir
 * @returns Boolean
 * @description check if the dir existed or not.
 */
export function dirExistHelper(dir: string): Boolean {
  return fs.existsSync(path.join(__dirname, `../../images/${dir}`));
}

export const typeRegexp = /^![a-zA-Z\s]+$/;
