import { BufferResolvable, Message } from 'discord.js';
import * as fs from 'fs';
import path from 'path';

function randMax(max: number) {
  return Math.trunc((1e9 * Math.random()) % max);
}

async function getImageBufferHelper(type: string): Promise<BufferResolvable> {
  const imagePath = path.join(__dirname, `../../images/${type}/${randMax(20)}`);
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer;
}

async function whatToEatHandler(message: Message, type: string) {
  message.channel.send({
    files: [
      {
        attachment: await getImageBufferHelper(type),
      },
    ],
  });
}

async function messageHandler(message: Message) {
  if (message.content === '!吃啥') whatToEatHandler(message, 'food');
}

export default messageHandler;
