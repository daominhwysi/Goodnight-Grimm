import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';
import { loadCommands, handleCommand } from './utils/commandHandler';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages
    ]
});

// Tải các lệnh khi bot sẵn sàng
client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    loadCommands(client); // Tải các lệnh từ các file
});

client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return; // Bỏ qua tin nhắn từ bot khác

    // Xử lý lệnh từ tin nhắn
    await handleCommand(client , message);
});

client.login(process.env.TOKEN);
