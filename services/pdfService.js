const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

/**
 * =====================================================
 * SERVICE : Multiple Images to PDF
 * =====================================================
 */

async function createPdf(images) {

    // Folder temp
    const tempDir = path.join(__dirname, "../temp");

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    // Nama file PDF
    const fileName = `images_${Date.now()}.pdf`;

    const pdfPath = path.join(tempDir, fileName);

    // Buat dokumen PDF
    const pdfDoc = await PDFDocument.create();

    // ===============================
    // Ukuran A4
    // ===============================
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;

    // Margin halaman
    const MARGIN = 20;

    // Proses setiap gambar
    for (const media of images) {

        // Decode Base64
        const imageBuffer = Buffer.from(
            media.data,
            "base64"
        );

        let image;

        // PNG
        if (media.mimetype === "image/png") {

            image = await pdfDoc.embedPng(
                imageBuffer
            );

        }

        // JPG / JPEG
        else if (
            media.mimetype === "image/jpeg" ||
            media.mimetype === "image/jpg"
        ) {

            image = await pdfDoc.embedJpg(
                imageBuffer
            );

        }

        // Skip jika bukan gambar
        else {

            continue;

        }

        // Ukuran gambar
        const imgWidth = image.width;
        const imgHeight = image.height;

        // Tambahkan halaman A4
        const page = pdfDoc.addPage([
            PAGE_WIDTH,
            PAGE_HEIGHT
        ]);

        // Area maksimum gambar
        const maxWidth = PAGE_WIDTH - (MARGIN * 2);
        const maxHeight = PAGE_HEIGHT - (MARGIN * 2);

        // Hitung skala agar gambar tetap proporsional
        const scale = Math.min(
            maxWidth / imgWidth,
            maxHeight / imgHeight
        );

        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        // Posisi tengah halaman
        const x = (PAGE_WIDTH - drawWidth) / 2;
        const y = (PAGE_HEIGHT - drawHeight) / 2;

        // Gambar
        page.drawImage(image, {

            x,

            y,

            width: drawWidth,

            height: drawHeight

        });

    }

    // Simpan PDF
    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(
        pdfPath,
        pdfBytes
    );

    return pdfPath;

}

module.exports = {
    createPdf
};