// untuk menampilkan menu perintah yang tersedia
async function handleMenuCommand(message, text) {
    if (text !== '!menu') {
        return false;
    }

    // untuk menampilkan menu perintah yang tersedia
    await message.reply(
`
                    |CONTROL PANEL|

    SYSTEM
    !info
    !status
    !ping
    !help

    ADMINISTRATOR
    !add <nomor>
    !kick <mention>
    !tagall <pesan>
    !del (reply message)
    !groupinfo
    !poll <pertanyaan>|<opsi1>|<opsi2>|dst

    USER
    !owner

    UTILITY
    !waktu
    !tanggal
    !ocr (reply to image)

    MEDIA
    !wallpaper <keyword>
    !sticker (reply to image)
    !qc <teks>
    !pdf mulai
    !scap (reply to image) gunakan "|" untuk teks atas dan bawah
    !pins <keyword>
    !removebg (reply to image)
    
    DOWNLOADER
    !tt <url>

    TRANSLATOR
    !id <teks>
    !en <teks>

    AI
    !ai <pertanyaan>

    =============================
    Awaiting your command...
    =============================`
    );

    return true;
}

// untuk menampilkan menu perintah yang tersedia
module.exports = {
    handleMenuCommand
};