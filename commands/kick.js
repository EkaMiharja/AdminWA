const { isOwner } = require("../utils/owner");
const { getGroupData, removeGroupParticipants, safeDelete } = require("../utils/media");

const {
    getMentionParticipants,
    isAdmin,
    isBot,
    isBotAdmin
} = require("../utils/groupUtils");

async function handleKickCommand(message, client) {

    const text = message.body.trim();

    if (!text.toLowerCase().startsWith("!kick")) {
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

    if (!(await isBotAdmin(message, client))) {
        await message.reply(
            "Bot harus menjadi admin grup."
        );
        return true;
    }

    const participants = await getMentionParticipants(message, client);

    if (participants.length === 0) {
        await message.reply(
            "Silakan mention anggota yang ingin dikeluarkan.\n\nContoh:\n!kick @user"
        );
        return true;
    }

    let success = 0;
    let failed = 0;

    for (const participant of participants) {

        try {

            if (isBot(message, participant)) {
                failed++;
                continue;
            }

            if (isAdmin(participant)) {
                failed++;
                continue;
            }

            const result = await removeGroupParticipants(
                client, chatId, [participant.id._serialized]
            );

            if (result) {
                success++;
            } else {
                failed++;
            }

        } catch (err) {
            console.error(err);
            failed++;
        }

    }

    await safeDelete(message);

    if (success > 0 && failed === 0) {
        await message.reply(
            `Berhasil mengeluarkan ${success} anggota.`
        );
    } else if (success > 0 && failed > 0) {
        await message.reply(
            `Berhasil: ${success}\nGagal: ${failed}`
        );
    } else {
        await message.reply(
            "Tidak ada anggota yang berhasil dikeluarkan."
        );
    }

    return true;
}

module.exports = {
    handleKickCommand
};
