module.exports = (message, client, handler) => {
    if (message.author.bot) return; // Ignore messages from bots
  
    const keywordRegex = /\bcan i have embeds\b/i;
  
    if (keywordRegex.test(message.content)) {
      message.reply("NO YOU CAN NOT!");
    }
  };
  