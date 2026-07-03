const { createCanvas, loadImage } = require("canvas");

async function createScapImage(imageBuffer, caption) {
    const image = await loadImage(imageBuffer);

    const width = image.width;
    const height = image.height;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Gambar asli
    ctx.drawImage(image, 0, 0, width, height);

    const fontFamily = "Arial";

    let fontSize = Math.floor(width / 6);
    const minFontSize = 30;
    const maxFontSize = Math.floor(width / 3);

    if (fontSize > maxFontSize) {
        fontSize = maxFontSize;
    }

    const padding = Math.floor(width / 25);

    // Padding vertikal berdasarkan tinggi gambar
    const topPadding = Math.max(40, Math.floor(height * 0.12));
    const bottomPadding = Math.max(40, Math.floor(height * 0.12));

    // Pisahkan teks atas dan bawah
    let topText = "";
    let bottomText = caption;

    if (caption.includes("|")) {
        const parts = caption.split("|");

        topText = parts[0].trim().toUpperCase();
        bottomText = parts[1].trim().toUpperCase();
    } else {
        bottomText = caption.trim().toUpperCase();
    }

    function wrapLines(text, size) {

        ctx.font = `bold ${size}px ${fontFamily}`;

        const words = text.split(" ");
        const lines = [];

        let line = "";

        for (const word of words) {

            const testLine = line ? line + " " + word : word;

            if (ctx.measureText(testLine).width > width - padding * 2) {

                if (line) {
                    lines.push(line);
                    line = word;
                } else {
                    lines.push(testLine);
                    line = "";
                }

            } else {

                line = testLine;

            }
        }

        if (line) {
            lines.push(line);
        }

        return lines;
    }

    // Mengecilkan font otomatis
    function fitText(text) {

        let size = fontSize;
        let lines = wrapLines(text, size);

        while (size > minFontSize && lines.length > 3) {
            size -= 2;
            lines = wrapLines(text, size);
        }

        return {
            size,
            lines
        };
    }

    const top = fitText(topText);
    const bottom = fitText(bottomText);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#FFF";

    // Outline lebih tebal
    function drawLines(lines, size, startY) {

        ctx.font = `bold ${size}px ${fontFamily}`;
        ctx.lineWidth = Math.max(5, Math.floor(size / 8));

        const lineHeight = size + 10;

        let y = startY;

        for (const line of lines) {

            ctx.strokeText(line, width / 2, y);
            ctx.fillText(line, width / 2, y);

            y += lineHeight;
        }
    }

    // TEXT ATAS
    if (top.lines.length > 0) {

        drawLines(
            top.lines,
            top.size,
            topPadding
        );

    }

    // TEXT BAWAH
    if (bottom.lines.length > 0) {

        const lineHeight = bottom.size + 10;

        const startY =
            height -
            bottomPadding -
            ((bottom.lines.length - 1) * lineHeight);

        drawLines(
            bottom.lines,
            bottom.size,
            startY
        );

    }

    return canvas.toBuffer("image/png");
}

module.exports = {
    createScapImage
};