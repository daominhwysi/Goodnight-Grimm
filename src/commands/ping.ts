import { Message } from 'discord.js';

export const data = {
    name: 'ping',
};

export const execute = (message: Message, args: string[]) => {
    message.reply('Pong!');
};
