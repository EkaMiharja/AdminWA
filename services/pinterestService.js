const axios = require("axios");

/**
 * =====================================================
 * SERVICE : Pinterest Search
 * =====================================================
 */

async function searchPinterest(query) {

    try {

        const response = await axios.get(
            "https://apina.bythenan.my.id/api/search/pinterest",
            {
                params: {
                    text: query
                },
                timeout: 15000
            }
        );

        const data = response.data;

        // Validasi response
        if (
            !data ||
            data.status !== true ||
            !Array.isArray(data.result)
        ) {
            return [];
        }

        return data.result;

    } catch (err) {

        console.error(
            "[Pinterest API]",
            err.message
        );

        return [];
    }

}

module.exports = {
    searchPinterest
};