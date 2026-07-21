const { isOwner } = require("../utils/owner");
const { getGroupData, safeDelete } = require("../utils/media");

async function handleTagAllCommand(message, client) {

    const text = message.body.trim();

    if (!text.toLowerCase().startsWith("!tagall")) {
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

    const pesan = text.replace(/^!tagall\s*/i, "").trim();

    if (!pesan) {
        await message.reply(
            "Masukkan pesan.\n\nContoh:\n!tagall Hai semuanya"
        );
        return true;
    }

    try {

        const groupData = await getGroupData(client, chatId);
        if (!groupData) {
            await message.reply("Gagal mengambil data grup.");
            return true;
        }

        const participants = groupData.participants || [];
        const mentions = [];

        for (const participant of participants) {
            try {
                const contact = await client.getContactById(
                    participant.id._serialized
                );
                if (contact) mentions.push(contact);
            } catch (err) {
                console.log("Gagal mengambil contact:", participant.id._serialized);
            }
        }

        await client.sendMessage(chatId, pesan, { mentions: mentions.filter(Boolean) });

        await safeDelete(message);

    } catch (err) {
        console.error(err);
        await message.reply("Gagal mengirim tag all.");
    }

    return true;
}

module.exports = {
    handleTagAllCommand
};
