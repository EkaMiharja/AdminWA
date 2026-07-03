const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

/**
 * =====================================================
 * SERVICE : OCR
 * Fungsi  : Mengambil teks dari gambar
 * =====================================================
 */

// Fungsi untuk mengekstrak teks dari gambar menggunakan Tesseract OCR
async function extractText(media) {

    // Folder temp
    const tempDir = path.join(
        __dirname,
        '../temp'
    );

    if (!fs.existsSync(tempDir)) {

        fs.mkdirSync(
            tempDir,
            {
                recursive: true
            }
        );

    }

    // Tentukan ekstensi gambar
    let extension = '.png';

    if (media.mimetype === 'image/jpeg') {

        extension = '.jpg';

    } else if (media.mimetype === 'image/webp') {

        extension = '.webp';

    }

    // Nama file sementara
    const imagePath = path.join(
        tempDir,
        `ocr_${Date.now()}${extension}`
    );

    // Simpan gambar
    fs.writeFileSync(
        imagePath,
        Buffer.from(
            media.data,
            'base64'
        )
    );

    try {

        // OCR
        const result =
            await Tesseract.recognize(
                imagePath,
                'ind+eng',
                {
                    logger: info => {

                        if (
                            info.status ===
                            'recognizing text'
                        ) {

                            console.log(
                                `OCR Progress : ${Math.round(info.progress * 100)}%`
                            );

                        }

                    }
                }
            );

        // Hapus file sementara
        if (fs.existsSync(imagePath)) {

            fs.unlinkSync(imagePath);

        }

        return result.data.text.trim();

    } catch (error) {

        // Tetap hapus file jika terjadi error
        if (fs.existsSync(imagePath)) {

            fs.unlinkSync(imagePath);

        }

        throw error;

    }

}

module.exports = {
    extractText
};