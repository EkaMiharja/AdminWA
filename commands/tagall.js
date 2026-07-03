const { isOwner } = require("../utils/owner");

/**
 * =====================================================
 * COMMAND : !tagall
 * Fungsi  : Mention semua anggota grup tanpa
 *           menampilkan daftar mention.
 * Author  : M. Eka
 * =====================================================
 */

async function handleTagAllCommand(message) {

    const text = message.body.trim();

    // Bukan command
    if (!text.toLowerCase().startsWith("!tagall")) {
        return false;
    }

    // Harus di grup
    const chat = await message.getChat();

    if (!chat.isGroup) {

        await message.reply(
            "❌ Command ini hanya dapat digunakan di grup."
        );

        return true;
    }

    // Hanya owner
    if (!(await isOwner(message))) {

        await message.reply(
            "❌ Command ini hanya dapat digunakan oleh owner bot."
        );

        return true;
    }

    // Ambil isi pesan
    const pesan = text.replace(/^!tagall\s*/i, "").trim();

    if (!pesan) {

        await message.reply(
            "❌ Masukkan pesan.\n\nContoh:\n!tagall Hai semuanya"
        );

        return true;
    }

    try {

        const mentions = [];

        // Ambil seluruh contact
        for (const participant of chat.participants) {

            try {

                const contact =
                    await message.client.getContactById(
                        participant.id._serialized
                    );

                mentions.push(contact);

            } catch (err) {

                console.log(
                    "Gagal mengambil contact:",
                    participant.id._serialized
                );

            }

        }

        // Kirim pesan tanpa daftar @
        await chat.sendMessage(
            pesan,
            {
                mentions
            }
        );

        // Hapus command
        await message.delete(true);

    } catch (err) {

        console.error(err);

        await message.reply(
            "❌ Gagal mengirim tag all."
        );

    }

    return true;

}

module.exports = {
    handleTagAllCommand
};