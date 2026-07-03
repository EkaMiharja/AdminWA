/**
 * =====================================================
 * GROUP UTILITIES
 * Compatible : whatsapp-web.js v1.34.7
 * Author     : M. Eka
 * =====================================================
 */

/**
 * Mengambil participant yang di-mention.
 * Menggunakan getMentions() karena compatible
 * dengan LID Addressing Mode.
 */
async function getMentionParticipant(message) {

    const chat = await message.getChat();

    const mentions = await message.getMentions();

    if (mentions.length === 0) {
        return null;
    }

    const contact = mentions[0];

    return chat.participants.find(
        p => p.id.user === contact.id.user
    ) || null;

}

/**
 * Mengambil seluruh participant yang di-mention.
 */
async function getMentionParticipants(message) {

    const chat = await message.getChat();

    const mentions = await message.getMentions();

    if (mentions.length === 0) {
        return [];
    }

    const participants = [];

    for (const contact of mentions) {

        const participant = chat.participants.find(
            p => p.id.user === contact.id.user
        );

        if (participant) {
            participants.push(participant);
        }

    }

    return participants;

}

/**
 * Mengecek apakah target adalah admin.
 */
function isAdmin(participant) {

    if (!participant) return false;

    return (
        participant.isAdmin ||
        participant.isSuperAdmin
    );

}

/**
 * Mengecek apakah target adalah bot.
 */
function isBot(message, participant) {

    if (!participant) return false;

    return (
        participant.id.user ===
        message.client.info.wid.user
    );

}

/**
 * Mengambil participant bot.
 */
async function getBotParticipant(message) {

    const chat = await message.getChat();

    return chat.participants.find(
        p => p.id.user ===
        message.client.info.wid.user
    ) || null;

}

/**
 * Mengecek apakah bot admin.
 */
async function isBotAdmin(message) {

    const bot = await getBotParticipant(message);

    if (!bot) return false;

    return (
        bot.isAdmin ||
        bot.isSuperAdmin
    );

}

module.exports = {

    getMentionParticipant,

    getMentionParticipants,

    getBotParticipant,

    isAdmin,

    isBot,

    isBotAdmin

};