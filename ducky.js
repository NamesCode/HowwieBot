module.exports = (message, client, handler) => {
    if (message.author.bot) return; // Ignore messages from bots
  
    const keywordRegex = /\bducky\b/i;
    const userID = "857259247963865088"; // Specific user ID to ping
  
    if (keywordRegex.test(message.content)) {
      message.reply(`<@${userID}> is a certified space cowboy.`);
    }
  };