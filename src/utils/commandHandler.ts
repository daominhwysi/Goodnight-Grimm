import { Client, Collection, Message } from 'discord.js';
import path from 'path';
import fs from 'fs';

const loadCommands = (client: Client) => {
    const commands = new Collection<string, any>();
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.set(command.data.name, command);
    }

    (client as any).commands = commands;
};

const handleCommand = async (client: Client, message: Message) => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = (client as any).commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error while executing this command!');
    }
};

export { loadCommands, handleCommand };
