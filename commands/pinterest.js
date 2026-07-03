const { MessageMedia } = require("whatsapp-web.js");
const { searchPinterest } = require("../services/pinterestService");

/**
 * =====================================================
 * COMMAND : !pins
 * Fungsi  : Mencari gambar dari Pinterest
 * =====================================================
 */

async function handlePinterestCommand(message) {

    const body = message.body.trim();

    // Bukan command !pins
    if (!body.toLowerCase().startsWith("!pins")) {
        return false;
    }

    // Ambil keyword
    const keyword = body.substring(5).trim();

    if (!keyword) {

        await message.reply(
`Format:

!pins <keyword>

Contoh:
!pins kucing lucu
!pins naruto
!pins mobil jepang`
        );

        return true;
    }

    try {

        await message.reply("Sedang mencari gambar...");

        const results = await searchPinterest(keyword);

        if (!results || results.length === 0) {

            await message.reply(
                "Gambar tidak ditemukan."
            );

            return true;
        }

        // Pilih gambar secara acak
        const randomImage =
            results[Math.floor(Math.random() * results.length)];

        // Download langsung dari URL
        const media = await MessageMedia.fromUrl(randomImage);

        await message.reply(
            media,
            undefined,
            {
                caption: `Hasil pencarian: ${keyword}`
            }
        );

    } catch (err) {

        console.error(err);

        await message.reply(
            "Terjadi kesalahan saat mencari gambar."
        );

    }

    return true;
}

module.exports = {
    handlePinterestCommand
};