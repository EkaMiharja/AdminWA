/**
 * =====================================================
 * COMMAND : !sticker
 * Fungsi  : Mengubah gambar menjadi sticker WhatsApp
 * Cara    :
 * 1. Reply gambar
 * 2. Ketik !sticker
 * =====================================================
 */

async function handleStickerCommand(message) {

    const text = message.body.toLowerCase().trim();

    // Bukan command !sticker
    if (text !== '!sticker') {
        return false;
    }

    // Harus reply pesan
    if (!message.hasQuotedMsg) {
        await message.reply(
            'Silakan reply gambar dengan command !sticker.'
        );
        return true;
    }

    // Ambil pesan yang direply
    const quotedMessage = await message.getQuotedMessage();

    // Harus berupa gambar
    if (!quotedMessage.hasMedia) {
        await message.reply(
            'Pesan yang direply tidak mengandung gambar.'
        );
        return true;
    }

    // Download media
    const media = await quotedMessage.downloadMedia();

    // Kirim sebagai sticker
    await message.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerName: 'JARVIS Sticker',
        stickerAuthor: 'Anonymous'
    });

    return true;
}

module.exports = {
    handleStickerCommand
};