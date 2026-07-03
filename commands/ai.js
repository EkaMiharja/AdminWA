// untuk menangani perintah AI
const { generateAiReply } = require('../services/geminiService');

// untuk menangani perintah AI dari pengguna
async function handleAiCommand(message, context) {
    const { userPrompt, ai } = context;

    await message.reply('Processing request...');

    const answer = await generateAiReply(ai, userPrompt);

    await message.reply(answer);
}

// untuk menangani perintah AI dari pengguna dan mengirimkan balasan 
module.exports = {
    handleAiCommand
};