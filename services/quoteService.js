const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Memecah teks menjadi paragraf.
 */
function splitParagraphs(text) {

    return String(text)
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0);
}

/**
 * Membungkus teks menjadi beberapa baris.
 */
function wrapText(ctx, text, maxWidth) {

    const words = text.split(/\s+/);

    const lines = [];

    let currentLine = '';

    for (const word of words) {

        const testLine =
            currentLine + word + ' ';

        const testWidth =
            ctx.measureText(testLine).width;

        if (testWidth > maxWidth && currentLine !== '') {

            lines.push(currentLine.trim());

            currentLine = word + ' ';

        } else {

            currentLine = testLine;

        }

    }

    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }

    return lines;
}

/**
 * Cari ukuran font terbesar yang tetap muat di kanvas.
 */
function fitTextLayout(ctx, paragraphs, options) {

    const {
        maxWidth,
        maxHeight,
        maxFontSize,
        minFontSize,
        fontFamily,
        fontWeight,
        lineHeightRatio,
        paragraphSpacingRatio
    } = options;

    for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 1) {

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

        const lines = [];

        paragraphs.forEach(paragraph => {
            const wrappedLines = wrapText(ctx, paragraph, maxWidth);

            wrappedLines.forEach((line, index) => {
                lines.push({
                    text: line,
                    isParagraphEnd: index === wrappedLines.length - 1,
                    isLastLine: false
                });
            });
        });

        if (lines.length === 0) {
            return {
                fontSize,
                lineHeight: Math.ceil(fontSize * lineHeightRatio),
                paragraphSpacing: Math.ceil(fontSize * paragraphSpacingRatio),
                lines
            };
        }

        lines[lines.length - 1].isLastLine = true;

        const lineHeight = Math.ceil(fontSize * lineHeightRatio);
        const paragraphSpacing = Math.ceil(fontSize * paragraphSpacingRatio);

        const totalHeight = lines.reduce((height, line, index) => {
            const isLast = index === lines.length - 1;
            const extraSpacing = line.isParagraphEnd && !isLast ? paragraphSpacing : 0;

            return height + lineHeight + extraSpacing;
        }, 0);

        if (totalHeight <= maxHeight) {
            return {
                fontSize,
                lineHeight,
                paragraphSpacing,
                lines
            };
        }
    }

    const fontSize = minFontSize;

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const lines = [];

    paragraphs.forEach(paragraph => {
        const wrappedLines = wrapText(ctx, paragraph, maxWidth);

        wrappedLines.forEach((line, index) => {
            lines.push({
                text: line,
                isParagraphEnd: index === wrappedLines.length - 1,
                isLastLine: false
            });
        });
    });

    if (lines.length > 0) {
        lines[lines.length - 1].isLastLine = true;
    }

    return {
        fontSize,
        lineHeight: Math.ceil(fontSize * lineHeightRatio),
        paragraphSpacing: Math.ceil(fontSize * paragraphSpacingRatio),
        lines
    };
}

/**
 * Gambar baris teks dengan justify.
 */
function drawJustifiedLine(ctx, line, x, y, maxWidth, isLastLine) {

    const words = line.trim().split(/\s+/).filter(Boolean);

    if (words.length <= 1 || isLastLine) {
        ctx.fillText(line.trim(), x, y);
        return;
    }

    const wordsWidth = words.reduce((totalWidth, word) => {
        return totalWidth + ctx.measureText(word).width;
    }, 0);

    const spaceWidth = ctx.measureText(' ').width;
    const extraSpace = maxWidth - wordsWidth;
    const gaps = words.length - 1;
    const justifiedSpace = gaps > 0 ? extraSpace / gaps : spaceWidth;

    let currentX = x;

    words.forEach((word, index) => {
        ctx.fillText(word, currentX, y);

        if (index < words.length - 1) {
            currentX += ctx.measureText(word).width + justifiedSpace;
        }
    });
}

/**
 * Tambahkan efek buram dan noise ringan ke hasil akhir.
 */
function applyBlurAndNoise(canvas, width, height) {

    const workingCanvas = createCanvas(width, height);
    const workingCtx = workingCanvas.getContext('2d');

    workingCtx.imageSmoothingEnabled = true;
    workingCtx.imageSmoothingQuality = 'high';

    workingCtx.drawImage(canvas, 0, 0, width, height);

    const blurCanvas = createCanvas(width, height);
    const blurCtx = blurCanvas.getContext('2d');

    blurCtx.imageSmoothingEnabled = true;
    blurCtx.imageSmoothingQuality = 'high';

    const downscaleWidth = Math.max(1, Math.round(width * 0.23));
    const downscaleHeight = Math.max(1, Math.round(height * 0.23));

    blurCtx.clearRect(0, 0, width, height);
    blurCtx.drawImage(
        workingCanvas,
        0,
        0,
        width,
        height,
        0,
        0,
        downscaleWidth,
        downscaleHeight
    );

    workingCtx.clearRect(0, 0, width, height);
    workingCtx.drawImage(
        blurCanvas,
        0,
        0,
        downscaleWidth,
        downscaleHeight,
        0,
        0,
        width,
        height
    );

    workingCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    workingCtx.fillRect(0, 0, width, height);

    const noiseDensity = Math.floor(width * height * 0.05);

    for (let index = 0; index < noiseDensity; index += 1) {

        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const size = Math.random() < 0.6 ? 1 : 2;
        const shade = 160 + Math.floor(Math.random() * 70);
        const alpha = 0.07 + Math.random() * 0.12;

        workingCtx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
        workingCtx.fillRect(x, y, size, size);
    }

    return workingCanvas;
}

/**
 * Membuat gambar quote
 */
async function createQuoteImage(text) {

    const width = 512;
    const height = 512;

    const canvas =
        createCanvas(width, height);

    const ctx =
        canvas.getContext('2d');

    const textCanvas =
        createCanvas(width, height);

    const textCtx =
        textCanvas.getContext('2d');

    // ==========================
    // Background
    // ==========================

    ctx.fillStyle = '#FFFFFF';

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    // ==========================
    // Pengaturan Teks
    // ==========================

    const padding = 40;

    const maxWidth =
        width - (padding * 2);

    const paragraphs = splitParagraphs(text);

    const textLayout = fitTextLayout(
        textCtx,
        paragraphs,
        {
            maxWidth,
            maxHeight: height - (padding * 2),
            maxFontSize: 80,
            minFontSize: 50,
            fontFamily: 'Arial',
            fontWeight: 'bold',
            lineHeightRatio: 1.25,
            paragraphSpacingRatio: 0.45
        }
    );

    const fontSize = textLayout.fontSize;

    const lineHeight = textLayout.lineHeight;

    const paragraphSpacing = textLayout.paragraphSpacing;

    textCtx.fillStyle = '#000000';

    textCtx.font = `bold ${fontSize}px Arial`;

    textCtx.textAlign = 'left';

    textCtx.textBaseline = 'top';

    // Hitung posisi awal agar berada di tengah
    const totalHeight = textLayout.lines.reduce((height, line, index) => {
        const isLast = index === textLayout.lines.length - 1;
        const extraSpacing = line.isParagraphEnd && !isLast ? paragraphSpacing : 0;

        return height + lineHeight + extraSpacing;
    }, 0);

    let y =
        (height - totalHeight) / 2 +
        0;

    // Gambar setiap baris
    textLayout.lines.forEach(line => {

        drawJustifiedLine(
            textCtx,
            line.text,
            padding,
            y,
            maxWidth,
            line.isLastLine
        );

        y += lineHeight;

        if (line.isParagraphEnd && !line.isLastLine) {
            y += paragraphSpacing;
        }

    });

    const finalTextCanvas = applyBlurAndNoise(textCanvas, width, height);

    ctx.drawImage(finalTextCanvas, 0, 0);

    // Simpan ke folder temp
    const tempFolder =
        path.join(
            __dirname,
            '../temp'
        );

    if (!fs.existsSync(tempFolder)) {

        fs.mkdirSync(tempFolder);

    }

    const imagePath =
        path.join(
            tempFolder,
            'quote.png'
        );

    fs.writeFileSync(
        imagePath,
        canvas.toBuffer('image/png')
    );

    return imagePath;

}

module.exports = {
    createQuoteImage
};