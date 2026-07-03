const { isOwner } = require("../utils/owner");
const { isBotAdmin } = require("../utils/groupUtils");

/**
 * =====================================================
 * COMMAND : !groupinfo
 * Fungsi  : Menampilkan informasi grup
 * Author  : M. Eka
 * =====================================================
 */

async function handleGroupInfoCommand(message) {

    const text = message.body.trim();

    if (text.toLowerCase() !== "!groupinfo") {
        return false;
    }

    const chat = await message.getChat();

    if (!chat.isGroup) {

        await message.reply(
            "❌ Command ini hanya dapat digunakan di grup."
        );

        return true;
    }

    if (!(await isOwner(message))) {

        await message.reply(
            "❌ Command ini hanya dapat digunakan oleh owner bot."
        );

        return true;
    }

    try {

        const groupName = chat.name;
        const groupId = chat.id._serialized;

        const memberCount = chat.participants.length;

        const adminCount = chat.participants.filter(
            p => p.isAdmin || p.isSuperAdmin
        ).length;

        let owner = "-";

        if (chat.groupMetadata?.owner) {

            owner =
                chat.groupMetadata.owner.user ??
                chat.groupMetadata.owner;

        }

        const description =
            chat.groupMetadata?.desc ||
            "Tidak ada deskripsi.";

        const botAdmin =
            await isBotAdmin(message);

        // Ambil link grup
        let groupLink = "-";

        if (botAdmin) {

            try {

                const inviteCode =
                    await chat.getInviteCode();

                groupLink =
                    `https://chat.whatsapp.com/${inviteCode}`;

            } catch {

                groupLink =
                    "Tidak dapat mengambil link grup.";

            }

        } else {

            groupLink =
                "Bot bukan admin.";

        }

        const info =
`📋 *GROUP INFORMATION*

📛 *Nama Grup* = ${groupName}

🆔 *ID Grup* = ${groupId}

👥 *Jumlah Anggota* = ${memberCount} Orang

👮 *Jumlah Admin* = ${adminCount} Orang

👑 *Owner Grup* = ${owner}

🤖 *Bot Admin* = ${botAdmin ? "Ya ✅" : "Tidak ❌"}

🔗 *Link Grup* = ${groupLink}

📝 *Deskripsi* = ${description}
`;

        await message.reply(info);

    } catch (err) {

        console.error(err);

        await message.reply(
            "Gagal mengambil informasi grup."
        );

    }

    return true;
}

module.exports = {
    handleGroupInfoCommand
};