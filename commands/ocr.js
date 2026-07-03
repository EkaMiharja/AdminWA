const { extractText } = require('../services/ocrService');

/**
 * =====================================================
 * COMMAND : !ocr
 * Fungsi  : Mengambil teks dari gambar (OCR)
 * =====================================================
 */

// untuk menangani perintah !ocr
async function handleOcrCommand(message) {

    const text = message.body.toLowerCase().trim();

    // Validasi command
    if (text !== '!ocr') {
        return false;
    }

    // Harus reply pesan
    if (!message.hasQuotedMsg) {

        await message.reply(
            'Silakan reply gambar dengan command !ocr.'
        );

        return true;
    }

    // Ambil pesan yang direply
    const quotedMessage =
        await message.getQuotedMessage();

    // Harus berupa media
    if (!quotedMessage.hasMedia) {

        await message.reply(
            'Pesan yang direply tidak memiliki media.'
        );

        return true;
    }

    // Download media
    const media =
        await quotedMessage.downloadMedia();

    // Validasi harus gambar
    if (!media.mimetype.startsWith('image/')) {

        await message.reply(
            'Media harus berupa gambar.'
        );

        return true;
    }

    try {

        await message.reply(
            'Reading text from image...'
        );

        // OCR
        const result =
            await extractText(media);

        if (!result.trim()) {

            await message.reply(
                'Tidak ada teks yang berhasil ditemukan.'
            );

            return true;
        }

        await message.reply(
`HASIL OCR

${result}`
        );

    } catch (error) {

        console.error(error);

        await message.reply(
            'Failed to read image.'
        );

    }

    return true;
}

module.exports = {
    handleOcrCommand
};