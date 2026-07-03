async function handleSystemCommand(message, text) {
    switch (text) {
    
    // untuk menampilkan daftar command yang tersedia
    case '!info':
        await message.reply(
`JARVIS SYSTEM INFORMATION

Assistant Name : JARVIS
Version        : 1.0
Platform       : Node.js
Library        : whatsapp-web.js

All systems are operating normally.`
        );
        return true;
    
    // untuk menampilkan owner bot
    case '!owner':
        await message.reply(
`AUTHORIZED USER

Name        : M. Eka
Institution : Politeknik Negeri Jakarta
Program     : Teknik Multimedia dan Jaringan

Access level verified.`
        );
        return true;
    
    // untuk mengecek apakah bot sedang aktif
    case '!ping':
        await message.reply(
`Yes Sir!.

JARVIS is online and ready to assist.`
        );
        return true;
    
    // untuk menampilkan status bot
    case '!status':
        const uptime = process.uptime();

        await message.reply(
`SYSTEM STATUS

Status      : ONLINE
Uptime      : ${Math.floor(uptime / 60)} Minutes
Response    : Normal
Condition   : Optimal

No anomalies detected.`
        );
        return true;
    
    // untuk menampilkan waktu
    case '!waktu':
        await message.reply(
`CURRENT TIME

${new Date().toLocaleString('id-ID')}

Time synchronization completed.`
        );
        return true;
    
    // untuk menampilkan tanggal
    case '!tanggal':
        await message.reply(
`CURRENT DATE

${new Date().toLocaleDateString('id-ID')}

Calendar data retrieved successfully.`
        );
        return true;
    
    // untuk menampilkan menu perintah
    case '!help':
        await message.reply(
`
- SYSTEM

!menu
Menampilkan daftar command yang tersedia.

!info
Menampilkan informasi bot.

!status
Menampilkan status dan uptime bot.

!ping
Mengecek apakah bot sedang aktif.

- ADMINISTRATOR

!del (reply message)
Menghapus pesan yang di-reply.

!kick <mention>
Mengeluarkan anggota dari grup.

!tagall <pesan>
Mengirimkan pesan ke semua anggota grup tanpa menampilkan daftar mention.

!groupinfo
Menampilkan informasi grup.

!poll <pertanyaan>|<opsi1>|<opsi2>|...
Membuat polling di grup.

- USER

!owner
Menampilkan informasi developer bot.

- UTILITY

!waktu
Menampilkan waktu saat ini.

!tanggal
Menampilkan tanggal saat ini.

- MEDIA

!wallpaper <keyword>
Mencari gambar dari Unsplash.

!sticker
Mengubah gambar menjadi sticker.
(Cara: reply gambar lalu ketik !sticker)

!qc <teks>
Membuat sticker dari teks.

!pdf mulai
Menggabungkan beberapa gambar menjadi PDF.
(Cara: reply gambar lalu ketik !pdf mulai)

!scap <teks>
Membuat sticker meme dengan teks.

!ocr
Mengambil teks dari gambar.
(Cara: reply gambar lalu ketik !ocr)

!pins <keyword>
Mencari gambar dari Pinterest.

!removebg
Menghapus background gambar. (Reply Gambar)

- DOWNLOADER

!tt <url>
Mengunduh video TikTok tanpa watermark.

- TRANSLATOR

!id <teks>
Mengubah teks menjadi Bahasa Indonesia.

!en <teks>
Mengubah teks menjadi Bahasa Inggris.

- AI

!ai <pertanyaan>
Bertanya kepada JARVIS menggunakan Gemini AI.

=========================
JARVIS Assistant v1.0
=========================`
    );
    return true;

    default:
        return false;
    }
}

module.exports = {
    handleSystemCommand
};