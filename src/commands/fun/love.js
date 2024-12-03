const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('burp')
    .setDescription('double burp'),
  async execute(interaction) {
    await interaction.reply('I LOVE LASAGNA FEET');
  },
};
