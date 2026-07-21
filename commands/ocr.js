const { extractText } = require('../services/ocrService');
const { getQuotedMedia } = require('../utils/media');

async function handleOcrCommand(message, client) {

    const text = message.body.toLowerCase().trim();

    if (text !== '!ocr') {
        return false;
    }

    if (!message.hasQuotedMsg) {
        await message.reply(
            'Silakan reply gambar dengan command !ocr.'
        );
        return true;
    }

    try {

        const media = await getQuotedMedia(message, client);

        if (!media) {
            await message.reply('Gagal mengunduh gambar.');
            return true;
        }

        if (!media.mimetype.startsWith('image/')) {
            await message.reply('Media harus berupa gambar.');
            return true;
        }

        await message.reply('Reading text from image...');

        const result = await extractText(media);

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
        await message.reply('Failed to read image.');
    }

    return true;
}

module.exports = {
    handleOcrCommand
};
