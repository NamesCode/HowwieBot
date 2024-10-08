module.exports = (message, client, handler) => {
  const greetingRegex = /\b(hi|heya|hey|hello|hai)\b/i;

  if (greetingRegex.test(message.content)) {
    message.reply("Hiya! :3");
  }
};
