const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("burp").setDescription("double burp"),
  run: async ({ interaction }) => {
    await interaction.reply("I LOVE LASAGNA FEET");
  },
  options: {
    devOnly: false,
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false,
  },
};
