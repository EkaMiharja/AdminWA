require('dotenv').config();

const env = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY
};

module.exports = {
    env
};