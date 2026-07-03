const { translateText } = require("../services/translateService");

async function handleTranslateCommand(message) {

    const body = message.body.trim();

    let targetLanguage = null;
    let text = "";

    // =========================
    // !en
    // =========================

    if (body.toLowerCase().startsWith("!en")) {

        targetLanguage = "en";
        text = body.substring(3).trim();

    }

    // =========================
    // !id
    // =========================

    else if (body.toLowerCase().startsWith("!id")) {

        targetLanguage = "id";
        text = body.substring(3).trim();

    }

    else {

        return false;

    }

    if (!text) {

        await message.reply(
`Format:

!en Saya sedang belajar Node.js

!id I am learning Node.js`
        );

        return true;

    }

    try {

        const translated = await translateText(
            text,
            "auto",
            targetLanguage
        );

        await message.reply(`${translated}`);

    } catch (err) {

        await message.reply(
            "Gagal menerjemahkan teks."
        );

    }

    return true;
}

module.exports = {
    handleTranslateCommand
};