const { GoogleGenAI } = require('@google/genai');

// Fungsi untuk membuat klien Gemini
function createGeminiClient(apiKey) {
    return new GoogleGenAI({
        apiKey
    });
}

// Fungsi untuk menghasilkan balasan AI menggunakan model Gemini
async function generateAiReply(ai, userPrompt) {
    const prompt = `
            Anda adalah JARVIS.

            Aturan:
            - Jawab dalam Bahasa Indonesia.
            - Maksimal 150 kata.
            - Ringkas, jelas, dan langsung ke inti.
            - Jika pertanyaan membutuhkan kode, berikan kode yang relevan tanpa penjelasan berlebihan.

            Pertanyaan:
            ${userPrompt}
            `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
}

module.exports = {
    createGeminiClient,
    generateAiReply
};