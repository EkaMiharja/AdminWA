/**
 * =====================================================
 * COMMAND : !qc
 * Fungsi  : Membuat sticker dari teks
 * =====================================================
 */

const { MessageMedia } = require('whatsapp-web.js');
const { createQuoteImage } = require('../services/quoteService');

// fungsi untuk menangani perintah !qc
async function handleQuoteCommand(message) {

    const text = message.body.trim();

    if (!text.toLowerCase().startsWith('!qc ')) {
        return false;
    }

    const quote = text.slice(4).trim();

    // jika teks kosong, kirim pesan balasan
    if (!quote) {

        await message.reply(
            'Masukkan teks.\n\nContoh:\n!qc Halo Dunia'
        );

        return true;
    }

    try {

        const imagePath = await createQuoteImage(quote);

        const media = MessageMedia.fromFilePath(imagePath);

        // kirim media sebagai sticker
        await message.reply(
            media,
            undefined,
            {
                sendMediaAsSticker: true,
                stickerName: 'JARVIS Quote',
                stickerAuthor: 'Anonymous'
            }
        );

    } catch (error) {

        console.error(error);

        //jika terjadi kesalahan, kirim pesan balasan
        await message.reply(
            'Gagal membuat sticker.'
        );
    }

    return true;
}

module.exports = {
    handleQuoteCommand
};