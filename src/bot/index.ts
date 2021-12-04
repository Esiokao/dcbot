import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import messageHandler from './handlers';

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => console.log('bot is ready'));

client.on('message', messageHandler);

export default client;
