module.exports = (message, client, handler) => {
    if (message.author.bot) return; // Ignore messages from bots

    const keywordRegex = /\bbleh\b/i; // Regex to match the word 'bleh', case insensitive

    if (keywordRegex.test(message.content)) {
        const stickerPath = 'images/IMG_7729.png'; // Absolute path to your sticker image
        try {
            // Send the sticker as a reply to the message
            message.reply({ files: [stickerPath] });
        } catch (error) {
            console.error('Failed to send image:', error);
        }
    }
};
