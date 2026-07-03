/**
 * =====================================================
 * OWNER UTILITIES
 * Author : M. Eka
 * =====================================================
 */

/**
 * Mengecek apakah pengirim adalah owner bot
 */
async function isOwner(message) {

    const contact = await message.getContact();

    const ownerNumber = process.env.OWNER_NUMBER?.trim();

    if (!ownerNumber) {
        throw new Error(
            "OWNER_NUMBER belum diset pada file .env"
        );
    }

    return contact.id.user === ownerNumber;

}

/**
 * Mengambil nomor owner dari .env
 */
function getOwnerNumber() {

    return process.env.OWNER_NUMBER?.trim();

}

module.exports = {
    isOwner,
    getOwnerNumber
};  