const { MessageMedia } = require('whatsapp-web.js');

async function getQuotedMedia(message, client) {
    if (!message.hasQuotedMsg) return null;

    const quotedData = message._data.quotedMsg;
    if (!quotedData) return null;

    return downloadMediaFromData(client, quotedData);
}

async function downloadMediaFromData(client, data) {
    const result = await client.pupPage.evaluate(async (mediaData) => {
        try {
            const hasDirectPath = !!(mediaData.directPath || mediaData.directpath);

            const mockQpl = {
                addAnnotations: function () { return this; },
                addPoint: function () { return this; },
            };
            const decryptedMedia = await window
                .require('WAWebDownloadManager')
                .downloadManager.downloadAndMaybeDecrypt({
                    directPath: mediaData.directPath || mediaData.directpath,
                    encFilehash: mediaData.encFilehash || mediaData.encFileHash,
                    filehash: mediaData.filehash || mediaData.fileHash,
                    mediaKey: mediaData.mediaKey,
                    mediaKeyTimestamp: mediaData.mediaKeyTimestamp,
                    type: mediaData.type,
                    signal: new AbortController().signal,
                    downloadQpl: mockQpl,
                });
            const rawData = await window.WWebJS.arrayBufferToBase64Async(decryptedMedia);
            return {
                data: rawData,
                mimetype: mediaData.mimetype || mediaData.mimeType,
                filename: mediaData.filename,
                filesize: mediaData.size
            };
        } catch (e) {
            return {
                _error: true,
                name: e?.name || typeof e,
                message: e?.message || String(e),
                hasDirectPath: !!(mediaData?.directPath || mediaData?.directpath),
                mediaKeys: mediaData ? Object.keys(mediaData).join(', ') : 'null'
            };
        }
    }, data);

    if (!result) return null;
    if (result._error) {
        console.error('downloadMediaFromData error:', result);
        return null;
    }
    return new MessageMedia(result.mimetype, result.data, result.filename, result.filesize);
}

async function downloadMessageMedia(message, client) {
    if (!message.hasMedia) return null;

    const mediaData = message._data;
    if (!mediaData || (!mediaData.directPath && !mediaData.directpath)) return null;

    return downloadMediaFromData(client, mediaData);
}

async function getGroupData(client, chatId) {
    const result = await client.pupPage.evaluate(async (cid) => {
        try {
            const wid = window.require('WAWebWidFactory').createWid(cid);
            const chat = window.require('WAWebCollections').Chat.get(wid);
            if (!chat) return { _error: true, message: 'Chat not found', cid: cid };

            const model = chat.serialize();
            model.isGroup = !!chat.groupMetadata;
            model.isMuted = chat.mute?.expiration !== 0;

            if (chat.groupMetadata) {
                const GroupMeta = window.require('WAWebCollections').GroupMetadata
                    || window.require('WAWebCollections').WAWebGroupMetadataCollection;
                await GroupMeta.update(wid);

                const lidUtils = window.require('WAWebLidMigrationUtils');
                const serializedMeta = chat.groupMetadata.serialize();
                for (const p of serializedMeta.participants || []) {
                    p.id = lidUtils.toPn(p.id) ?? p.id;
                }
                model.groupMetadata = serializedMeta;
            }

            model.participants = model.groupMetadata?.participants || [];
            delete model.msgs;
            delete model.msgUnsyncedButtonReplyMsgs;
            delete model.unsyncedButtonReplies;

            return model;

        } catch (e) {
            return {
                _error: true,
                name: e?.name || typeof e,
                message: e?.message || String(e),
                cid: cid,
            };
        }
    }, chatId);

    if (!result || result._error) {
        if (result?._error) console.error('getGroupData error:', JSON.stringify(result, null, 2));
        return null;
    }
    return result;
}

async function removeGroupParticipants(client, chatId, participantIds) {
    return client.pupPage.evaluate(async (cid, pIds) => {
        try {
            const wid = window.require('WAWebWidFactory').createWid(cid);
            const chat = window.require('WAWebCollections').Chat.get(wid);
            if (!chat) return false;

            const participants = (await Promise.all(
                pIds.map(async (p) => {
                    const { lid, phone } = await window.WWebJS.enforceLidAndPnRetrieval(p);
                    return (chat.groupMetadata.participants.get(lid?._serialized) ||
                        chat.groupMetadata.participants.get(phone?._serialized));
                }),
            )).filter(Boolean);

            await window.require('WAWebModifyParticipantsGroupAction')
                .removeParticipants(chat, participants);
            return true;
        } catch (e) {
            return { _error: true, message: e?.message || String(e) };
        }
    }, chatId, participantIds);
}

async function getGroupInviteCode(client, chatId) {
    const result = await client.pupPage.evaluate(async (cid) => {
        try {
            const wid = window.require('WAWebWidFactory').createWid(cid);
            const chat = window.require('WAWebCollections').Chat.get(wid);
            if (!chat) return null;

            const code = await window.require('WAWebInviteQuery')
                .queryInviteCode(chat);
            return code?.code || null;
        } catch (e) {
            return { _error: true, message: e?.message || String(e) };
        }
    }, chatId);

    if (result?._error) {
        console.error('getGroupInviteCode error:', result);
        return null;
    }
    return result;
}

async function safeDelete(message) {
    try {
        await message.delete(true);
    } catch (e) {
        console.error('safeDelete failed:', e?.message || e);
    }
}

module.exports = {
    getQuotedMedia, downloadMediaFromData, downloadMessageMedia,
    getGroupData, removeGroupParticipants, getGroupInviteCode,
    safeDelete
};
