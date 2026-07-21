const { getGroupData } = require("./media");

async function getMentionParticipant(message, client) {
    const groupData = await getGroupData(client, message.from);
    if (!groupData) return null;

    const mentions = await message.getMentions();
    if (mentions.length === 0) return null;

    const contact = mentions[0];
    return groupData.participants.find(
        p => p.id.user === contact.id.user
    ) || null;
}

async function getMentionParticipants(message, client) {
    const groupData = await getGroupData(client, message.from);
    if (!groupData) return [];

    let mentions;
    try {
        mentions = await message.getMentions();
    } catch {
        mentions = [];
    }
    if (mentions.length === 0) return [];

    const participants = [];
    for (const contact of mentions) {
        const participant = groupData.participants.find(
            p => p.id.user === contact.id.user
        );
        if (participant) participants.push(participant);
    }
    return participants;
}

function isAdmin(participant) {
    if (!participant) return false;
    return participant.isAdmin || participant.isSuperAdmin;
}

function isBot(message, participant) {
    if (!participant) return false;
    return participant.id.user === message.client.info.wid.user;
}

async function getBotParticipant(message, client) {
    const groupData = await getGroupData(client, message.from);
    if (!groupData) return null;

    return groupData.participants.find(
        p => p.id.user === message.client.info.wid.user
    ) || null;
}

async function isBotAdmin(message, client) {
    const bot = await getBotParticipant(message, client);
    if (!bot) return false;
    return bot.isAdmin || bot.isSuperAdmin;
}

module.exports = {
    getMentionParticipant,
    getMentionParticipants,
    getBotParticipant,
    isAdmin,
    isBot,
    isBotAdmin
};
