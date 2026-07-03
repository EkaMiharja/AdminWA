const { env } = require('../config/config');

async function handleWallpaperCommand(message, context) {
    const { keyword, client, MessageMedia, searchWallpapers } = context;

    await message.reply(`Searching image: ${keyword}`);

    const results = await searchWallpapers(keyword, env.UNSPLASH_ACCESS_KEY);

    if (results.length === 0) {
        await message.reply('No image found.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * results.length);

    const imageUrl = results[randomIndex].urls.regular;

    const selectedImage = results[randomIndex];

    const photographer = selectedImage.user.name;

    const media = await MessageMedia.fromUrl(
        imageUrl,
        {
            unsafeMime: true
        }
    );

    await client.sendMessage(
        message.from,
        media,
        {
            caption: `Search Result: ${keyword}\nPhotographer: ${photographer}`
        }
    );
}

module.exports = {
    handleWallpaperCommand
};