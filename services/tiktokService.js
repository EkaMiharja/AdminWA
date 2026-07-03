const fs = require("fs-extra");
const path = require("path");
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
        const result = data && data.result ? data.result : null;

        // Validasi response
        if (
            !data ||
            (data.status !== true && data.success !== true) ||
            !result
        ) {

            return {
                success: false
            };

        }

        const medias = Array.isArray(result.medias)
            ? result.medias
            : Array.isArray(result.data && result.data.medias)
                ? result.data.medias
                : [];

        const getType = media => String(media && media.type ? media.type : "").toLowerCase();

        const getLabel = media => String(media && media.label ? media.label : "").toLowerCase();

        // ==========================
        // Prioritas kualitas
        // ==========================

        let selected = medias.find(media =>
            getType(media) === "video" &&
            getLabel(media).includes("hd") &&
            getLabel(media).includes("no watermark")
        );

        if (!selected) {

            selected = medias.find(media =>
                getType(media) === "video" &&
                getLabel(media).includes("no watermark")
            );

        }

        if (!selected) {

            selected = medias.find(media =>
                getType(media) === "video" &&
                media.url
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

async function downloadVideo(url) {

    const tempDir = path.join(__dirname, "..", "temp");

    await fs.ensureDir(tempDir);

    const fileName = `tiktok_${Date.now()}.mp4`;

    const filePath = path.join(tempDir, fileName);

    const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        timeout: 60000,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Referer": "https://www.tiktok.com/",
            "Accept": "*/*"
        }
    });

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {

        writer.on("finish", resolve);

        writer.on("error", reject);

    });

    return filePath;

}

module.exports = {
    downloadTikTok,
    downloadVideo
};