const fs = require("fs");
const path = require("path");
const { removeBackground } = require("@imgly/background-removal-node");

/**
 * =====================================================
 * SERVICE : Remove Background
 * =====================================================
 */

async function removeBackgroundImage(media) {

    // Folder temp
    const tempDir = path.join(__dirname, "../temp");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const imageBuffer = Buffer.from(
    media.data,
    "base64"
    );

    // Beri informasi tipe file
    const imageBlob = new Blob(
        [imageBuffer],
        {
            type: media.mimetype
        }
    );

    const result = await removeBackground(imageBlob);

    // Konversi hasil ke Buffer
    const outputBuffer = Buffer.from(
        await result.arrayBuffer()
    );

    // Nama file
    const outputPath = path.join(
        tempDir,
        `removebg_${Date.now()}.png`
    );

    // Simpan file
    fs.writeFileSync(
        outputPath,
        outputBuffer
    );

    return outputPath;

}

module.exports = {
    removeBackgroundImage
};