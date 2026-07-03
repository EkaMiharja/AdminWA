/**
 * =====================================================
 * COMMAND : !scap <teks>
 * Fungsi  : Membuat sticker meme dengan teks
 * Cara    :
 * 1. Reply gambar
 * 2. Ketik !scap teksnya
 * =====================================================
 */

const { MessageMedia } = require("whatsapp-web.js");
const { createScapImage } = require("../services/scapService");

// fungsi untuk menangani perintah !scap
async function handleScapCommand(message) {

    const body = message.body.trim();

    // Bukan command !scap
    if (!body.toLowerCase().startsWith("!scap")) {
        return false;
    }

    // Ambil caption
    const caption = body.slice(5).trim();

    if (!caption) {
        await message.reply(
            "Format:\n\n!scap <teks>\n\nContoh:\n!scap APA TUH"
        );
        return true;
    }

    // Harus reply gambar
    if (!message.hasQuotedMsg) {
        await message.reply(
            "Silakan reply gambar kemudian ketik !scap <teks>"
        );
        return true;
    }

    const quotedMessage = await message.getQuotedMessage();

    // Harus gambar
    if (!quotedMessage.hasMedia) {
        await message.reply(
            "Pesan yang direply harus berupa gambar."
        );
        return true;
    }

    try {

        await message.reply("Membuat sticker...");

        // Download gambar
        const media = await quotedMessage.downloadMedia();

        if (!media) {
            await message.reply("Gagal mengunduh gambar.");
            return true;
        }

        // Base64 -> Buffer
        const imageBuffer = Buffer.from(media.data, "base64");

        // Proses gambar
        const outputBuffer = await createScapImage(
            imageBuffer,
            caption
        );

        // Buffer -> MessageMedia
        const stickerMedia = new MessageMedia(
            "image/png",
            outputBuffer.toString("base64")
        );

        // Kirim sebagai sticker
        await message.reply(stickerMedia, undefined, {
            sendMediaAsSticker: true,
            stickerName: "JARVIS Scap",
            stickerAuthor: "Anonymous"
        });

    } catch (err) {

        console.error(err);

        await message.reply(
            "Gagal membuat sticker."
        );
    }

    return true;
}

module.exports = {
    handleScapCommand
};