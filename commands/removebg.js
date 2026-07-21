const fs = require("fs");
const path = require("path");
const { MessageMedia } = require("whatsapp-web.js");
const { removeBackgroundImage } = require("../services/removebgService");
const { getQuotedMedia } = require("../utils/media");

async function handleRemoveBgCommand(message, client) {

    const text = message.body.toLowerCase().trim();

    if (text !== "!removebg") {
        return false;
    }

    if (!message.hasQuotedMsg) {
        await message.reply(
            "Silakan reply gambar dengan command !removebg."
        );
        return true;
    }

    try {

        const media = await getQuotedMedia(message, client);

        if (!media) {
            await message.reply("Gagal mengunduh gambar.");
            return true;
        }

        if (!media.mimetype.startsWith("image/")) {
            await message.reply("Media harus berupa gambar.");
            return true;
        }

        await message.reply(
            "Sedang menghapus background..."
        );

        const outputPath = await removeBackgroundImage(media);

        const result = MessageMedia.fromFilePath(outputPath);

        await message.reply(result, undefined, {
            sendMediaAsDocument: true,
            filename: "removebg.png"
        });

        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }

    } catch (err) {
        console.error(err);
        await message.reply("Gagal menghapus background.");
    }

    return true;
}

module.exports = {
    handleRemoveBgCommand
};
