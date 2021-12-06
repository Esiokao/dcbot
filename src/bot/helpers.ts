import { BufferResolvable, Message } from 'discord.js';
import * as fs from 'fs';
import path from 'path';
/**
 * @param  {number} max
 * @returns {number}
 * @description get a number from a range.
 */
export function randMax(max: number): number {
  return Math.trunc((1e9 * Math.random()) % max) || 0;
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

export async function sendImageContentHelper(
  message: Message,
  type: string,
  notFound: boolean = false
): Promise<void> {
  if (notFound) {
    message.channel.send({
      content: `Seems like there's no such related result 😢 `,
    });
  } else {
    message.channel.send({
      files: [
        {
          attachment: await getImageBufferHelper(type),
        },
      ],
    });
  }
}

/**
 * @param  {string} dir
 * @returns Boolean
 * @description check if the dir existed or not.
 */
export function dirExistHelper(dir: string): Boolean {
  return fs.existsSync(path.join(__dirname, `../../images/${dir}`));
}

export function fileExistHelper(dir: string, filename: string, format: 'jpg' | 'json'): Boolean {
  return fs.existsSync(path.join(__dirname, `../../images/${dir}/${filename}.${format}`));
}

export const typeRegexp = /^![a-zA-Z\s]+$/;
