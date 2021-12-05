import { Message } from 'discord.js';
import { URL } from 'url';
import { getImageBufferHelper, typeRegexp, dirExistHelper } from './helpers';
import crawler from '../crawler';
import targetBaseUrl from '../crawler/crawler.config';

async function whatToEatHandler(message: Message, type: string): Promise<void> {
  message.channel.send({
    files: [
      {
        attachment: await getImageBufferHelper(type),
      },
    ],
  });
}

async function typeToEatHanlder(message: Message): Promise<void> {
  if (typeRegexp.test(message.content)) {
    const type: string = message.content.substring(1).toLowerCase().trim();
    const targetUrl = new URL(targetBaseUrl.href + type);
    if (dirExistHelper(type)) {
      message.channel.send({
        files: [
          {
            attachment: await getImageBufferHelper(type),
          },
        ],
      });
    } else {
      await crawler(targetUrl.href, type);
      message.channel.send({
        files: [
          {
            attachment: await getImageBufferHelper(type),
          },
        ],
      });
    }
  }
}

async function messageHandler(message: Message) {
  if (message.content === '!吃啥') await whatToEatHandler(message, 'food');
  else if (typeRegexp.test(message.content)) await typeToEatHanlder(message);
}

export default messageHandler;
