const axios = require("axios");

/**
 * =====================================================
 * SERVICE : TikTok Downloader
 * =====================================================
 */

async function downloadTikTok(url) {

    try {

        const response = await axios.get(
            "https://apina.bythenan.my.id/api/downloader/tiktok",
            {
                params: {
                    url: url
                },
                timeout: 30000
            }
        );

        const data = response.data;

        // Validasi response
        if (
            !data ||
            data.status !== true ||
            !data.result ||
            !Array.isArray(data.result.medias)
        ) {

            return {
                success: false
            };

        }

        const medias = data.result.medias;

        // ==========================
        // Prioritas kualitas
        // ==========================

        let selected = medias.find(media =>
            media.type === "video" &&
            media.label.toLowerCase() === "hd no watermark"
        );

        if (!selected) {

            selected = medias.find(media =>
                media.type === "video" &&
                media.label.toLowerCase() === "no watermark"
            );

        }

        if (!selected) {

            selected = medias.find(media =>
                media.type === "video"
            );

        }

        if (!selected) {

            return {
                success: false
            };

        }

        return {

            success: true,

            videoUrl: selected.url,

            title: data.result.title,

            author: data.result.author,

            duration: data.result.duration,

            cover: data.result.cover

        };

    } catch (err) {

        console.error(
            "[TikTok Service]",
            err.message
        );

        return {
            success: false
        };

    }

}

module.exports = {
    downloadTikTok
};