import { Message } from 'discord.js';
import Database from 'better-sqlite3';

// Định nghĩa giao diện User nếu chưa có
import { User } from '../types/user';
// Mở cơ sở dữ liệu
const db = new Database('example.db');

// Dữ liệu lệnh
export const data = {
    name: 'points',
};

export const execute = (message: Message, args: string[]) => {
    const userId = message.author.id;

    // Truy vấn điểm của người chơi
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User;

    if (user) {
        // Nếu người chơi có điểm, trả về số điểm
        message.reply(`Bạn hiện có tổng cộng ${user.points} Grimm.`);
    } else {
        // Nếu người chơi chưa có điểm, thông báo chưa có dữ liệu
        message.reply('Bạn chưa có Grimm nào.');
    }
};
