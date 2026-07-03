const { GoogleGenAI } = require('@google/genai');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { handleStickerCommand } = require('./commands/sticker');
const { handleQuoteCommand } = require('./commands/qc');
const { handlePdfCommand } = require('./commands/pdf');
const { handleOcrCommand } = require('./commands/ocr');
const { handleScapCommand } = require("./commands/scap");
const { handleTranslateCommand } = require("./commands/translate");
const { handlePinterestCommand } = require("./commands/pinterest");
const { handleTikTokCommand } = require("./commands/tiktok");
const { handleRemoveBgCommand } = require("./commands/removebg");
const { handleDeleteCommand } = require("./commands/delete");
const { handleKickCommand } = require("./commands/kick");
const { handleTagAllCommand } = require("./commands/tagall");
const { handleGroupInfoCommand } = require("./commands/groupinfo");
const { handlePollCommand } = require("./commands/poll");
const { logIncomingMessage, logError } = require('./utils/logger');
const { handleMenuCommand } = require('./commands/menu');
const { handleSystemCommand } = require('./commands/system');
const { handleAiCommand } = require('./commands/ai');
const { handleWallpaperCommand } = require('./commands/wallpaper');
const { createGeminiClient } = require('./services/geminiService');
const { searchWallpapers } = require('./services/unsplashService');
const { env } = require('./config/config');

const ai = createGeminiClient(env.GEMINI_API_KEY);

const isDocker = process.platform === "linux";

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: ".wwebjs_auth"
    }),
    puppeteer: {
        headless: "shell",
        args: isDocker
            ? [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-features=site-per-process",
                "--disable-features=IsolateOrigins",
                "--disable-blink-features=AutomationControlled",
                "--window-size=1366,768"
            ]
            : []
    }
});

// QR Code Login
client.on('qr', (qr) => {
    console.log('Scan QR Code berikut untuk login:\n');
    qrcode.generate(qr, { small: true });
});

// Bot Ready
client.on('ready', () => {
    console.log('JARVIS Online');
});

client.on("disconnected", (reason) => {
    console.log("WhatsApp disconnected:", reason);
});

// Pesan Masuk
client.on('message', async (message) => {

    const now = Math.floor(Date.now() / 1000);
    const rawBody = message.body.trim();
    const isTikTokCommand = rawBody.toLowerCase().startsWith('!tt');

    if (!isTikTokCommand && (now - message.timestamp) > 15) {
        return;
    }

    const text = rawBody.toLowerCase();

    logIncomingMessage(message);

    if (text.startsWith('!wallpaper ')) {

        const keyword = text.replace('!wallpaper ', '');

        try {
            await handleWallpaperCommand(message, {
                keyword,
                client,
                MessageMedia,
                searchWallpapers
            });

        } catch (error) {
            logError(error);
            await message.reply('Failed to retrieve image.');
        }

        return;
    }

    if (text.startsWith('!ai ')) {

        const userPrompt = message.body.slice(4);

        try {
            await handleAiCommand(message, {
                userPrompt,
                ai
            });

        } catch (error) {
            logError(error);
            await message.reply('Failed to contact AI service.');
        }

        return;
    }

    // Sticker
    if (await handleStickerCommand(message, client)) {
        return;
    }

    // Quote
    if (await handleQuoteCommand(message, client)) {
        return;
    }

    // PDF
    if (await handlePdfCommand(message)) {
        return;
    }

    // OCR
    if (await handleOcrCommand(message)) {
        return;
    }

    // Scap
    if (await handleScapCommand(message)) {
        return;
    }

    // Translate
    if (await handleTranslateCommand(message)) {
        return;
    }

    // Pinterest
    if (await handlePinterestCommand(message)) {
        return;
    }

    // TikTok
    if (await handleTikTokCommand(message)) {
        return;
    }

    // RemoveBg
    if (await handleRemoveBgCommand(message)) {
        return;
    }

    // Delete
    if (await handleDeleteCommand(message)) {
        return;
    }

    // Kick
    if (await handleKickCommand(message)) {
        return;
    }

    // TagAll
    if (await handleTagAllCommand(message)) {
        return;
    }

    // Group Info
    if (await handleGroupInfoCommand(message)) {
        return;
    }

    // Poll
    if (await handlePollCommand(message)) {
        return;
    }

    // Menu
    if (await handleMenuCommand(message, text)) {
        return;
    }
    
    // System
    if (await handleSystemCommand(message, text)) {
        return;
    }

    // Jika bukan command, abaikan
    if (!text.startsWith('!')) {
        return;
    }

// Command tidak ditemukan
await message.reply(
    `Ketik *!menu* untuk melihat daftar fitur dan ketik *!help* untuk penjelasan setiap fitur.`
);

});

// Jalankan Bot
client.initialize();

async function shutdown(signal) {

    console.log(`Stopping (${signal})...`);

    try {
        await client.destroy();
    } catch (err) {
        console.error(err);
    }

    // Tunggu Chromium benar-benar berhenti
    setTimeout(() => {
        process.exit(0);
    }, 3000);   

}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
