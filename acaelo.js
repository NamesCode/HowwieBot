module.exports = (message, client, handler) => {
    if (message.author.bot) return; // Ignore messages from bots
  
    const keywordRegex = /\bacaelo\b/i;
  
    if (keywordRegex.test(message.content)) {
      message.reply("You mentioned acaelo!");
    }
  };
  
  