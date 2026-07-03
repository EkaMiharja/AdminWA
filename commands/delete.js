/**
 * =====================================================
 * COMMAND : !del
 * Fungsi  : Menghapus pesan yang di-reply
 * =====================================================
 */

async function handleDeleteCommand(message) {

    const text = message.body.toLowerCase().trim();

    // Bukan command !del
    if (text !== "!del") {
        return false;
    }

    // Harus reply pesan
    if (!message.hasQuotedMsg) {

        await message.reply(
            "Silakan reply pesan yang ingin dihapus."
        );

        return true;
    }

    try {

        // Ambil pesan yang direply
        const quotedMessage =
            await message.getQuotedMessage();

        // Hapus pesan
        await quotedMessage.delete(true);

        // Hapus command !del
        await message.delete(true);

    } catch (err) {

        console.error(err);

        await message.reply(
            "Gagal menghapus pesan."
        );

    }

    return true;

}

module.exports = {
    handleDeleteCommand
};