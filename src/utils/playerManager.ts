import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, VoiceConnection } from '@discordjs/voice';
let player: AudioPlayer | null = null;

export function setPlayer(newPlayer: AudioPlayer | null) {
  player = newPlayer;
}

export function getPlayer(): AudioPlayer | null {
  return player;
}