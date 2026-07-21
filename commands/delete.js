async function handleDeleteCommand(message, client) {

    const text = message.body.toLowerCase().trim();

    if (text !== "!del") {
        return false;
    }

    if (!message.hasQuotedMsg) {
        await message.reply("Silakan reply pesan yang ingin dihapus.");
        return true;
    }

    try {

        const stanzaId = message._data.quotedStanzaID;
        const participant = message._data.quotedParticipant;

        if (!stanzaId) {
            await message.reply("Gagal mendapatkan pesan.");
            return true;
        }

        const myNumberRaw = client?.info?.wid?._serialized || client?.info?.wid?.user;

        const result = await client.pupPage.evaluate(async (data) => {
            try {
                const { stanzaId, chatId, participant, myNumber } = data;

                const Msg = window.require('WAWebCollections').Msg;
                const Chat = window.require('WAWebCollections').Chat;
                const Cmd = window.require('WAWebCmd').Cmd;

                let debug = { stanzaId, chatId };
                let deleteOk = false;

                // Coba loadMessagesQuery
                try {
                    const msgs = await Msg.loadMessagesQuery(chatId);
                    debug.loadCount = msgs?.length || 0;

                    if (msgs && msgs.length > 0) {
                        // Cek model pertama
                        const first = msgs[0];
                        const collectionMethods = typeof msgs.findWhere;
                        const isBackbone = typeof msgs.at === 'function';
                        const isArray = Array.isArray(msgs);
                        debug.collectionInfo = { isArray, isBackbone, findWhere: collectionMethods };

                        let target = null;

                        if (isArray) {
                            target = msgs.find(m => {
                                const mid = typeof m === 'object' ? (m.id?.id || m._data?.id?.id || m.get?.('id')?.id) : null;
                                return mid === stanzaId;
                            });
                            debug.arrayFindResult = !!target;
                        } else if (isBackbone) {
                            target = msgs.findWhere({ 'id.id': stanzaId });
                            debug.findWhereResult = !!target;
                        }

                        if (target) {
                            debug.targetType = typeof target;
                            // Coba berbagai cara akses id
                            const idCandidates = [];
                            idCandidates.push(target.id);
                            try { idCandidates.push(target.get?.('id')); } catch(e) {}
                            try { idCandidates.push(target._data?.id); } catch(e) {}
                            try { idCandidates.push(target.attributes?.id); } catch(e) {}

                            let idObj = null;
                            for (const c of idCandidates) {
                                if (c && typeof c === 'object' && c.id) {
                                    idObj = c;
                                    break;
                                }
                            }

                            debug.idCandidateTypes = idCandidates.map(c => typeof c);
                            debug.hasIdObj = !!idObj;

                            if (idObj) {
                                // Pastikan semua field
                                if (!idObj._serialized) idObj._serialized = idObj.id;
                                if (!idObj.remote) idObj.remote = chatId;
                                if (idObj.fromMe === undefined) idObj.fromMe = participant === myNumber;

                                debug.finalIdObj = JSON.stringify(idObj);
                                debug.finalIdKeys = Object.keys(idObj);

                                let chat = Chat.get(chatId);
                                if (!chat) chat = await Chat.find(chatId);

                                if (chat) {
                                    const msgObj = { id: idObj };
                                    const useNew = window.WWebJS.compareWwebVersions(window.Debug.VERSION, '>=', '2.3000.0');
                                    try {
                                        if (useNew) {
                                            await Cmd.sendRevokeMsgs(chat, { list: [msgObj], type: 'message' }, { clearMedia: true });
                                        } else {
                                            await Cmd.sendRevokeMsgs(chat, [msgObj], { clearMedia: true, type: idObj.fromMe ? 'Sender' : 'Admin' });
                                        }
                                        debug.revoke = 'ok';
                                        deleteOk = true;
                                    } catch(e) {
                                        debug.revokeError = e?.message || String(e);
                                        try {
                                            if (useNew) {
                                                await Cmd.sendDeleteMsgs(chat, { list: [msgObj], type: 'message' }, true);
                                            } else {
                                                await Cmd.sendDeleteMsgs(chat, [msgObj], true);
                                            }
                                            debug.delete = 'ok';
                                            deleteOk = true;
                                        } catch(e2) {
                                            debug.deleteError = e2?.message || String(e2);
                                        }
                                    }
                                }
                            } else {
                                debug.noIdObj = true;
                                // Debug: dump target
                                debug.targetDump = JSON.stringify(target, (key, val) => {
                                    if (key.startsWith('_')) return undefined;
                                    return val;
                                }).slice(0, 500);
                            }
                        } else {
                            debug.targetNotFound = true;
                        }
                    }
                } catch(e) {
                    debug.loadError = e?.message || String(e);
                }

                return { _success: true, debug };
            } catch (e) {
                return { _error: true, name: e?.name, message: e?.message, stack: e?.stack };
            }
        }, {
            stanzaId,
            chatId: message.from,
            participant,
            myNumber: myNumberRaw
        });

        console.log('delete result:', JSON.stringify(result, null, 2));

        if (result._error) {
            await message.reply("Gagal menghapus pesan.");
            return true;
        }

        if (result.debug?.revoke === 'ok' || result.debug?.delete === 'ok') {
            await message.reply("Pesan berhasil dihapus ✅");
        } else {
            await message.reply("Gagal menghapus pesan.");
        }

    } catch (err) {
        console.error(err);
        try {
            await message.reply("Gagal menghapus pesan.");
        } catch(e) {}
    }

    return true;
}

module.exports = {
    handleDeleteCommand
};
