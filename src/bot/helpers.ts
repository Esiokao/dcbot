import { BufferResolvable, Message } from 'discord.js';
import * as fs from 'fs';
import path from 'path';
import { Config } from '../crawler/types';
/**
 * @param  {number} max
 * @returns {number}
 * @description get a number from a range.
 */
export function randMax(max: number): number {
  return Math.trunc((1e9 * Math.random()) % max) || 0;
}

export async function readConfigHelper(type: string, total: boolean = false): Promise<Config> {
  const config = await fs.promises.readFile(
    path.join(__dirname, `../../images/${type}/config.json`),
    {
      encoding: 'utf-8',
    }
  );
  const parsedConfig = await JSON.parse(config);
  const arrayFromConfig = Array.from<Config>(parsedConfig);
  const typeConfigObject = arrayFromConfig.filter(typeConfig => typeConfig.type === type)[0];
  const toalConfigObject = arrayFromConfig.filter(typeConfig => typeConfig.type === '$total')[0];
  if (total) {
    return toalConfigObject;
  }
  return typeConfigObject;
}

export async function getImageBufferHelper(type: string): Promise<BufferResolvable> {
  const { length } = await readConfigHelper(type, true);
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

export async function typeExistHelper(type: string, dir: string): Promise<Boolean> {
  if (fileExistHelper(dir, 'config', 'json')) {
    try {
      const config = await fs.promises.readFile(
        path.join(__dirname, `../../images/${dir}/config.json`),
        {
          encoding: 'utf-8',
        }
      );
      const parsedConfig = JSON.parse(config);
      const arrayFromConfig = Array.from<Config>(parsedConfig);
      const typeExist: Boolean = arrayFromConfig.some(configElement => configElement.type === type);
      return typeExist;
    } catch {
      throw new Error();
      return false;
    }
  }
  return false;
}

export const typeCommandRegexp = /^![a-zA-Z\s]+$/;
export const addCommandRegexp = /^!add\s[a-zA-Z\s]+$/;
