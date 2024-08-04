import { Message } from 'discord.js';
import { getPlayer } from '../utils/playerManager';

export const data = {
  name: 'resume',
};

export const execute = async (message: Message) => {
const player = getPlayer();
  if (!player) return message.reply('Hiện tại không có nhạc nào đang phát!');
  player.unpause();
  await message.reply('Nhạc đã được tiếp tục!');
};
