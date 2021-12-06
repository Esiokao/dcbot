import { Message } from 'discord.js';
import { URL } from 'url';
import {
  getImageBufferHelper,
  typeCommandRegexp,
  dirExistHelper,
  fileExistHelper,
  sendImageContentHelper,
  addCommandRegexp,
  typeExistHelper,
} from './helpers';
import crawler from '../crawler';
import targetBaseUrl from '../crawler/crawler.config';
/**
 * @param  {Message} message
 * @param  {string} type
 * @returns Promise
 */
async function whatToEatHandler(message: Message, type: string): Promise<void> {
  message.channel.send({
    files: [
      {
        attachment: await getImageBufferHelper(type),
      },
    ],
  });
}
/**
 * @param  {Message} message
 * @returns Promise
 */
async function typeToEatHanlder(message: Message): Promise<void> {
  const type: string = message.content.substring(1).toLowerCase().trim();
  const targetUrl = new URL(targetBaseUrl.href + type);
  if (!dirExistHelper(type)) await crawler(targetUrl.href, type, type);
  if (!fileExistHelper(type, 'config', 'json')) {
    sendImageContentHelper(message, type, true);
  } else {
    sendImageContentHelper(message, type);
  }
}

async function addTypeToEatHanlder(message: Message): Promise<void> {
  const type: string = message.content.substring(5).toLowerCase().trim();
  const targetUrl = new URL(targetBaseUrl.href + type);
  const typeExist = await typeExistHelper(type, 'food');
  if (!typeExist) await crawler(targetUrl.href, type, 'food');
  if (!fileExistHelper('food', 'config', 'json')) {
    sendImageContentHelper(message, 'food', true);
  } else {
    sendImageContentHelper(message, 'food');
  }
}
/**
 * @param  {Message} message
 * @returns Promise
 */
async function messageHandler(message: Message): Promise<void> {
  if (message.content === '!吃啥') await whatToEatHandler(message, 'food');
  else if (addCommandRegexp.test(message.content)) await addTypeToEatHanlder(message);
  else if (typeCommandRegexp.test(message.content)) await typeToEatHanlder(message);
}

export default messageHandler;
