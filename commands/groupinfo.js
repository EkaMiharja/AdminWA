const { isOwner } = require("../utils/owner");
const { isBotAdmin } = require("../utils/groupUtils");
const { getGroupData, getGroupInviteCode } = require("../utils/media");

async function handleGroupInfoCommand(message, client) {

    const text = message.body.trim();

    if (text.toLowerCase() !== "!groupinfo") {
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

    try {

        const groupData = await getGroupData(client, chatId);
        if (!groupData) {
            await message.reply("Gagal mengambil informasi grup.");
            return true;
        }

        const groupName = groupData.name;
        const groupId = groupData.id._serialized;

        const participants = groupData.participants || [];
        const memberCount = participants.length;
        const adminCount = participants.filter(
            p => p.isAdmin || p.isSuperAdmin
        ).length;

        let owner = "-";
        if (groupData.groupMetadata?.owner) {
            owner = groupData.groupMetadata.owner.user ??
                groupData.groupMetadata.owner;
        }

        const description = groupData.groupMetadata?.desc ||
            "Tidak ada deskripsi.";

        const botAdmin = await isBotAdmin(message, client);

        let groupLink = "-";
        if (botAdmin) {
            const inviteCode = await getGroupInviteCode(client, chatId);
            groupLink = inviteCode
                ? `https://chat.whatsapp.com/${inviteCode}`
                : "Tidak dapat mengambil link grup.";
        } else {
            groupLink = "Bot bukan admin.";
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
        await message.reply("Gagal mengambil informasi grup.");
    }

    return true;
}

module.exports = {
    handleGroupInfoCommand
};
