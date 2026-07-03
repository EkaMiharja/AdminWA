const fs = require("fs");
const path = require("path");
const { MessageMedia } = require("whatsapp-web.js");
const { createPdf } = require("../services/pdfService");

// Menyimpan sesi PDF setiap chat
const pdfSessions = new Map();

/**
 * =====================================================
 * COMMAND : !pdf
 * Fungsi  : Menggabungkan beberapa gambar menjadi PDF
 * =====================================================
 */

async function handlePdfCommand(message) {

    const body = message.body.trim().toLowerCase();
    const chatId = message.from;

    // !pdf mulai
    if (body === "!pdf mulai") {

        pdfSessions.set(chatId, []);

        await message.reply(
`Mode PDF aktif.

Silakan kirim gambar satu per satu.

Ketik:
• !pdf selesai
untuk membuat PDF

• !pdf batal
untuk membatalkan.`
        );

        return true;
    }

    // !pdf batal
    if (body === "!pdf batal") {

        pdfSessions.delete(chatId);

        await message.reply("Pembuatan PDF dibatalkan.");

        return true;
    }

    // Jika sedang mode PDF dan user mengirim gambar
    if (pdfSessions.has(chatId) && message.hasMedia) {

        const media = await message.downloadMedia();

        if (media && media.mimetype.startsWith("image/")) {

            pdfSessions.get(chatId).push(media);

            await message.reply(
                `Gambar ditambahkan.\n\nTotal gambar: ${pdfSessions.get(chatId).length}`
            );

        }

        return true;
    }

    // !pdf selesai
    if (body === "!pdf selesai") {

        if (!pdfSessions.has(chatId)) {

            await message.reply(
                "Belum ada sesi PDF.\n\nGunakan !pdf mulai"
            );

            return true;
        }

        const images = pdfSessions.get(chatId);

        if (images.length === 0) {

            await message.reply(
                "Belum ada gambar yang dikirim."
            );

            return true;
        }

        try {

            await message.reply("Sedang membuat PDF...");

            const pdfPath = await createPdf(images);

            const pdf = MessageMedia.fromFilePath(pdfPath);

            await message.reply(
                pdf,
                undefined,
                {
                    sendMediaAsDocument: true,
                    filename: "images.pdf"
                }
            );

            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }

            pdfSessions.delete(chatId);

        } catch (err) {

            console.error(err);

            await message.reply(
                "Gagal membuat PDF."
            );

        }

        return true;
    }

    return false;
}

module.exports = {
    handlePdfCommand
};