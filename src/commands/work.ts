import { Message } from 'discord.js';
import Database from 'better-sqlite3';
import { User } from '../types/user'; // Import interface

// Mở cơ sở dữ liệu
const db = new Database('example.db');

// Dữ liệu lệnh
export const data = {
    name: 'work',
};

// Thực thi lệnh
export const execute = (message: Message, args: string[]) => {
    const userId = message.author.id;
    const userName = message.author.username;

    // Tính điểm ngẫu nhiên cho người chơi
    const pointsEarned = Math.floor(Math.random() * 100) + 1; // Điểm từ 1 đến 100

    // Cập nhật điểm của người chơi trong cơ sở dữ liệu
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User;
    if (user) {
        // Nếu người chơi đã có trong cơ sở dữ liệu, cập nhật điểm
        db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(pointsEarned, userId);
    } else {
        // Nếu người chơi chưa có trong cơ sở dữ liệu, thêm mới
        db.prepare('INSERT INTO users (id, name, points) VALUES (?, ?, ?)').run(userId, userName, pointsEarned);
    }

    // Thông báo cho người chơi
    message.reply(`Bạn đã làm việc và kiếm được ${pointsEarned} Grimm!`);
};
