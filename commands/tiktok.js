const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs-extra");

const {

    downloadTikTok,

    downloadVideo

} = require("../services/tiktokService");

/**
 * =====================================================
 * COMMAND : !tt
 * Fungsi  : Download Video TikTok Tanpa Watermark
 * =====================================================
 */

async function handleTikTokCommand(message, client) {

    const body = message.body.trim();

    // Bukan command !tt
    if (!body.toLowerCase().startsWith("!tt")) {
        return false;
    }

    // Ambil URL
    const url = body.substring(3).trim();

    if (!url) {

        await message.reply(
`Format:

!tt <url>

Contoh:

!tt https://vt.tiktok.com/xxxxxx`
        );

        return true;
    }

    // Validasi URL TikTok
    if (
        !url.includes("tiktok.com") &&
        !url.includes("vt.tiktok.com")
    ) {

        await message.reply(
            "URL TikTok tidak valid."
        );

        return true;
    }

    try {

        await message.reply(
            "Sedang mengunduh video..."
        );

        // Ambil data dari service
        const result = await downloadTikTok(url);

        if (!result.success) {

            await message.reply(
                "Video tidak ditemukan."
            );

            return true;
        }

        // Download video ke folder temp
        const filePath = await downloadVideo(
            result.videoUrl
        );
        
        // Buat media dari file lokal
        const media = MessageMedia.fromFilePath(
            filePath
        );

        // Kirim video
        const chatId = message.fromMe ? message.to : message.from;

        await client.sendMessage(chatId, media);

// Hapus file sementara
await fs.remove(filePath);

    } catch (err) {

        console.error(err);

        await message.reply(
            "Gagal mengunduh video TikTok."
        );

    }

    return true;
}

module.exports = {
    handleTikTokCommand
};