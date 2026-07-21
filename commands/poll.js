const { Poll } = require("whatsapp-web.js");
const { isOwner } = require("../utils/owner");
const { safeDelete } = require("../utils/media");

async function handlePollCommand(message, client) {

    const text = message.body.trim();

    if (!text.toLowerCase().startsWith("!poll")) {
        return false;
    }

    const chatId = message.from;

    if (!chatId.includes("@g.us")) {
        await message.reply(
            "Command ini hanya dapat digunakan di grup."
        );
        return true;
    }

    if (!(await isOwner(message))) {
        await message.reply(
            "Command ini hanya dapat digunakan oleh owner bot."
        );
        return true;
    }

    const content = text.replace(/^!poll\s*/i, "").trim();

    if (!content) {
        await message.reply(
`Format salah.

Contoh:
!poll Makan dimana?|McD|KFC|Pizza Hut`
        );
        return true;
    }

    const parts = content
        .split("|")
        .map(item => item.trim())
        .filter(item => item.length > 0);

    if (parts.length < 3) {
        await message.reply(
            "Poll minimal memiliki 2 pilihan."
        );
        return true;
    }

    const question = parts.shift();
    const options = parts;

    try {

        const poll = new Poll(question, options);
        await client.sendMessage(chatId, poll);

        await safeDelete(message);

    } catch (err) {
        console.error(err);
        await message.reply("Gagal membuat poll.");
    }

    return true;
}

module.exports = {
    handlePollCommand
};
