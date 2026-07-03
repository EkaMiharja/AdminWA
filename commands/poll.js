const { Poll } = require("whatsapp-web.js");
const { isOwner } = require("../utils/owner");

/**
 * =====================================================
 * COMMAND : !poll
 * Fungsi  : Membuat Poll WhatsApp
 * Author  : M. Eka
 * =====================================================
 */

async function handlePollCommand(message) {

    const text = message.body.trim();

    // Bukan command
    if (!text.toLowerCase().startsWith("!poll")) {
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

    // Ambil isi setelah !poll
    const content = text.replace(/^!poll\s*/i, "").trim();

    if (!content) {

        await message.reply(
`❌ Format salah.

Contoh:
!poll Makan dimana?|McD|KFC|Pizza Hut`
        );

        return true;
    }

    // Pisahkan berdasarkan |
    const parts = content
        .split("|")
        .map(item => item.trim())
        .filter(item => item.length > 0);

    // Minimal 1 pertanyaan + 2 opsi
    if (parts.length < 3) {

        await message.reply(
            "❌ Poll minimal memiliki 2 pilihan."
        );

        return true;
    }

    const question = parts.shift();

    const options = parts;

    try {

        const poll = new Poll(
            question,
            options
        );

        await chat.sendMessage(
            poll
        );

        // Hapus command
        await message.delete(true);

    } catch (err) {

        console.error(err);

        await message.reply(
            "❌ Gagal membuat poll."
        );

    }

    return true;
}

module.exports = {
    handlePollCommand
};