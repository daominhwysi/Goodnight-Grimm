import { Message } from 'discord.js';
import { AudioPlayer } from '@discordjs/voice';
import { getPlayer } from '../utils/playerManager';

let player: AudioPlayer | null = null;

export const data = {
  name: 'pause',
};

export const execute = async (message: Message) => {
    const player = getPlayer()
    if (!player) return message.reply('Hiện tại không có nhạc nào đang phát!');
    player.pause();
    await message.reply('Nhạc đã được tạm dừng!');
};
