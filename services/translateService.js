const { translate } = require("@vitalets/google-translate-api");

async function translateText(text, from = "auto", to = "en") {

    try {

        const result = await translate(text, {
            from,
            to
        });

        return result.text;

    } catch (err) {

        console.error(err);

        throw err;
    }
}

module.exports = {
    translateText
};