const { isOwner } = require("../utils/owner");

const {
    getMentionParticipants,
    isAdmin,
    isBot,
    isBotAdmin
} = require("../utils/groupUtils");

/**
 * =====================================================
 * COMMAND : !kick
 * Fungsi  : Mengeluarkan anggota dari grup
 * =====================================================
 */

async function handleKickCommand(message) {

    const text = message.body.trim();

    // Bukan command
    if (!text.toLowerCase().startsWith("!kick")) {
        return false;
    }

    // Harus di grup
    const chat = await message.getChat();

    if (!chat.isGroup) {

        await message.reply(
            "Command ini hanya dapat digunakan di grup."
        );

        return true;
    }

    // Hanya owner
    if (!(await isOwner(message))) {

        await message.reply(
            "Command ini hanya dapat digunakan oleh owner bot."
        );

        return true;
    }

    // Bot harus admin
    if (!(await isBotAdmin(message))) {

        await message.reply(
            "Bot harus menjadi admin grup."
        );

        return true;
    }

    // Ambil semua anggota yang di-mention
    const participants =
        await getMentionParticipants(message);

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

            // Jangan kick bot
            if (isBot(message, participant)) {
                failed++;
                continue;
            }

            // Jangan kick admin
            if (isAdmin(participant)) {
                failed++;
                continue;
            }

            await chat.removeParticipants([
                participant.id._serialized
            ]);

            success++;

        } catch (err) {

            console.error(err);

            failed++;

        }

    }

    // Hapus command
    try {
        await message.delete(true);
    } catch (_) {}

    // Kirim hasil
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
            "❌ Tidak ada anggota yang berhasil dikeluarkan."
        );

    }

    return true;
}

module.exports = {
    handleKickCommand
};