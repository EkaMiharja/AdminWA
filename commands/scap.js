const { MessageMedia } = require("whatsapp-web.js");
const { createScapImage } = require("../services/scapService");
const { getQuotedMedia } = require("../utils/media");

async function handleScapCommand(message, client) {

    const body = message.body.trim();

    if (!body.toLowerCase().startsWith("!scap")) {
        return false;
    }

    const caption = body.slice(5).trim();

    if (!caption) {
        await message.reply(
            "Format:\n\n!scap <teks>\n\nContoh:\n!scap APA TUH"
        );
        return true;
    }

    if (!message.hasQuotedMsg) {
        await message.reply(
            "Silakan reply gambar kemudian ketik !scap <teks>"
        );
        return true;
    }

    try {

        await message.reply("Membuat sticker...");

        const media = await getQuotedMedia(message, client);

        if (!media) {
            await message.reply("Gagal mengunduh gambar.");
            return true;
        }

        const imageBuffer = Buffer.from(media.data, "base64");

        const outputBuffer = await createScapImage(
            imageBuffer,
            caption
        );

        const stickerMedia = new MessageMedia(
            "image/png",
            outputBuffer.toString("base64")
        );

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
