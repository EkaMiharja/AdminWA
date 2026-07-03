const fs = require("fs");
const path = require("path");
const { MessageMedia } = require("whatsapp-web.js");
const { removeBackgroundImage } = require("../services/removebgService");

/**
 * =====================================================
 * COMMAND : !removebg
 * Fungsi  : Menghapus background gambar
 * =====================================================
 */

async function handleRemoveBgCommand(message) {

    const text = message.body.toLowerCase().trim();

    // Bukan command
    if (text !== "!removebg") {
        return false;
    }

    // Harus reply gambar
    if (!message.hasQuotedMsg) {

        await message.reply(
            "Silakan reply gambar dengan command !removebg."
        );

        return true;
    }

    // Ambil pesan yang direply
    const quotedMessage = await message.getQuotedMessage();

    // Harus memiliki media
    if (!quotedMessage.hasMedia) {

        await message.reply(
            "Pesan yang direply tidak mengandung gambar."
        );

        return true;
    }

    // Download media
    const media = await quotedMessage.downloadMedia();

    // Validasi gambar
    if (!media.mimetype.startsWith("image/")) {

        await message.reply(
            "Media harus berupa gambar."
        );

        return true;
    }

    try {

        await message.reply(
            "Sedang menghapus background..."
        );

        // Proses remove background
        const outputPath = await removeBackgroundImage(media);

        // Kirim hasil
        const result = MessageMedia.fromFilePath(outputPath);

        await message.reply(
            result,
            undefined,
            {
                sendMediaAsDocument: true,
                filename: "removebg.png"
            }
        );

        // Hapus file sementara
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

    } catch (err) {

        console.error(err);

        await message.reply(
            "Gagal menghapus background."
        );

    }

    return true;
}

module.exports = {
    handleRemoveBgCommand
};