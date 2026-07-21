const { getQuotedMedia } = require('../utils/media');

async function handleStickerCommand(message, client) {

    const text = message.body.toLowerCase().trim();

    if (text !== '!sticker') {
        return false;
    }

    if (!message.hasQuotedMsg) {
        await message.reply(
            'Silakan reply gambar dengan command !sticker.'
        );
        return true;
    }

    try {

        const media = await getQuotedMedia(message, client);

        if (!media) {
            await message.reply('Gagal mengunduh gambar.');
            return true;
        }

        await message.reply(media, undefined, {
            sendMediaAsSticker: true,
            stickerName: 'JARVIS Sticker',
            stickerAuthor: 'Anonymous'
        });

    } catch (err) {
        console.error(err);
        await message.reply('Gagal membuat sticker.');
    }

    return true;
}

module.exports = {
    handleStickerCommand
};
