const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regard')
    .setDescription('Kaworu Nagisa : Yes, and you have my regard for it. Shinji Ikari : Regard?'),
  async execute(interaction) {
    await interaction.reply('In other words, I love you.');
  },
};
