const axios = require('axios');

async function searchWallpapers(keyword, accessKey) {
    const response = await axios.get(
        'https://api.unsplash.com/search/photos',
        {
            params: {
                query: keyword,
                per_page: 30
            },
            headers: {
                Authorization: `Client-ID ${accessKey}`
            }
        }
    );

    return response.data.results;
}

module.exports = {
    searchWallpapers
};