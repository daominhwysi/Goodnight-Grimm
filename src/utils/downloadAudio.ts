import ytdl from "@distube/ytdl-core";

import fs from 'fs'
import path from "path"
export async function downloadAudioAsMp3(url: string, outputPath: string, cookie : string = 'VISITOR_INFO1_LIVE=GJP0DwTb3fE; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgSw%3D%3D; LOGIN_INFO=AFmmF2swRgIhAJ9ShJxmihc8JjUug0oSIc4oCd4CWKQJW-SUHQB-6ld-AiEAjJiUXG7v-5-YVEEcMvtOknZOfL9iVcI_xaTpuWAk4Wc:QUQ3MjNmekxHZUNpT01JeVB6Q3FuRTA0cF9hbkJUbDJrSXNPMmhnblZqYWhXdU5NaG15cUFpSWtGVWtKMVpBS203OWN3YlRlbE5ObEMtc3pFdUl5QWg2ZzFFY015VmNkS2ZQNDNNLXJ2dkJtSGJRNHRGbWlkeHI3cFBST21OdXJ4c1RXOTdONDYzcmxkZ3B2WXRNb1d3bjBGVFFSalNORWR3; VISITOR_INFO1_LIVE=a66vmWGD2Vw; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgYg%3D%3D; HSID=AlSUkr3j7GaSO1Zl4; SSID=Aj7YhkefBkqW1O1jv; APISID=1WkqQHzKj-RJq6-O/ABy8j91U8fHfXsdDz; SAPISID=j2n-RDBN_kwHnFK1/Apjlrz3vHbEaAbZ_R; __Secure-1PAPISID=j2n-RDBN_kwHnFK1/Apjlrz3vHbEaAbZ_R; __Secure-3PAPISID=j2n-RDBN_kwHnFK1/Apjlrz3vHbEaAbZ_R; SID=g.a000lghEqihrJqQPc5_jhUjdtfLMwDRb5KKwD6H36X-qfsmERcjrWYIEawm19MjISqe6fJg5uAACgYKAf4SARMSFQHGX2MiL0DLe2ywVMqTmAx647fYkxoVAUF8yKrXfIaY_Rk9ARVpKs92EPnq0076; __Secure-1PSID=g.a000lghEqihrJqQPc5_jhUjdtfLMwDRb5KKwD6H36X-qfsmERcjrAZh7-Em-GMt_63e0uxerYgACgYKAd8SARMSFQHGX2MiNq262vOAE1NzQXUOvc2dahoVAUF8yKr73sQ1017GyRgH-ClYfkSo0076; __Secure-3PSID=g.a000lghEqihrJqQPc5_jhUjdtfLMwDRb5KKwD6H36X-qfsmERcjr7DROaNxN8yr-Z143_-g1twACgYKAfMSARMSFQHGX2MiDPtKkGE1KXIdmvlXugEknxoVAUF8yKqIyP9nsqI6RKF311O7I60o0076; PREF=f6=40000400&tz=Asia.Bangkok&f5=30000&f4=4000000&f7=150; YSC=yX_GQ01PtcI; __Secure-1PSIDTS=sidts-CjIB4E2dkXMitVTtFS0x0qZC7P7NUaUqqEFB6P6VKvGWapXie6dS9OYeLfNwscxvTp3MRBAA; __Secure-3PSIDTS=sidts-CjIB4E2dkXMitVTtFS0x0qZC7P7NUaUqqEFB6P6VKvGWapXie6dS9OYeLfNwscxvTp3MRBAA; SIDCC=AKEyXzUZ_G_01Z__gJ143vK6UAbMy-xYJJP3_TPb6lT5xAmgIHo5MJeEPBngSYV5do9M4BR6tlG_; __Secure-1PSIDCC=AKEyXzVUKXNboQq7pWLHYjOkZxC0shX2S1Ctwm1U78fQJSw0EKxxSw9xlcqSXAvLLzdPdLRbdT7t; __Secure-3PSIDCC=AKEyXzWlUd4g0XIPDaFe1C5wwMp6fEo7llfSZp6o840MBTmWKLMpQ2weLaA9yPeSGRbikVY5KKw'): Promise<void> {
  try {
    const agent = ytdl.createAgent([{ name: "cookie", value: cookie }]);
    const info = await ytdl.getInfo(url, { agent });
    const videoLengthSeconds = Number(info.videoDetails.lengthSeconds);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        agent
      });

      const writeStream = fs.createWriteStream(outputPath) as any;
      let totalBytes = 0;
      let downloadedBytes = 0;

      stream.on('response', (response) => {
        totalBytes = parseInt(response.headers['content-length'] || '0', 10);
        console.log(`Tổng kích thước: ${totalBytes}`);
      });

      stream.pipe(writeStream);

      stream.on('data', (chunk) => {
        downloadedBytes += chunk.length;
      });

      writeStream.on('finish', () => {
        console.log('\nTải thành công!');
        resolve();
      });

      writeStream.on('error', (err: any) => {
        console.error('Lỗi khi tải:', err);
        reject(err);
      });

      stream.on('error', (err) => {
        console.error('Lỗi khi tải stream:', err);
        reject(err);
      });
    });

  } catch (error) {
    console.error('Có lỗi khi lấy thông tin video:', error);
  }
}