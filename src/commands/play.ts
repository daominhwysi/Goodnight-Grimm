import { Message, VoiceChannel } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, AudioPlayer } from '@discordjs/voice';
import { downloadAudioAsMp3 } from '../utils/downloadAudio';
import { readFileSync, unlink } from 'fs';
import { setPlayer } from '../utils/playerManager';

const songQueue: string[] = [];
let player: AudioPlayer | null = null;

export const data = {
  name: 'play',
};

export const execute = async (message: Message, args: string[]) => {
  if (args.length === 0) {
    return message.reply('Bạn cần cung cấp URL YouTube!');
  }

  const url = args[0];
  const voiceChannel = message.member?.voice.channel as VoiceChannel;

  if (!message.guild) return message.reply('Có lỗi với guild!');
  if (!voiceChannel) return message.reply('Bạn phải ở trong một voice channel để phát nhạc!');

  const mp3Path = `./downloads/${Date.now()}.mp3`;

  try {
    await downloadAudioAsMp3(url, mp3Path);
    songQueue.push(mp3Path);

    if (!player) {
      // Kết nối tới voice channel
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('Đã kết nối đến voice channel!');
        playNextSong(connection);
      });

      connection.on('error', (err) => {
        console.error('Lỗi kết nối voice channel:', err);
        message.reply('Có lỗi khi kết nối tới voice channel!');
      });
    } else {
      // Nếu đã có player, chỉ cần thêm bài vào hàng đợi
      message.reply('Bài hát đã được thêm vào hàng đợi!');
    }
  } catch (error) {
    console.error('Lỗi khi tải hoặc phát nhạc:', error);
    message.reply('Có lỗi xảy ra khi tải hoặc phát nhạc!');
  }
};

const playNextSong = (connection: any) => {
  if (songQueue.length === 0) {
    console.log('Hàng đợi đã hết!');
    connection.destroy(); // Ngắt kết nối khi hàng đợi rỗng
    player = null;
    return;
  }

  const mp3Path = songQueue.shift()!;
  player = createAudioPlayer();
  setPlayer(player)
  const resource = createAudioResource(mp3Path);

  player.play(resource);
  connection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    // Xoá file mp3 sau khi phát xong
    unlink(mp3Path, (err) => {
      if (err) console.error('Không thể xoá file:', err);
      else console.log('Đã xoá file:', mp3Path);
    });
    playNextSong(connection); // Chơi bài tiếp theo
  });

  player.on('error', (error) => {
    console.error('Lỗi khi phát nhạc:', error);
    connection.destroy(); // Ngắt kết nối khi có lỗi
    player = null;
    console.log('Có lỗi xảy ra khi phát nhạc!');
  });
};
