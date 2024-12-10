const { SlashCommandBuilder } = require("discord.js");
const Guild = require("../../models/guild"); // Import the Guild model

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwelcomerole")
    .setDescription(
      "Set a role to assign to new members when they join the server."
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to assign to new members.")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const role = interaction.options.getRole("role"); // Get the role from the command options
    const guildId = interaction.guild.id; // Get the guild ID

    try {
      // Find or create the guild entry in the database
      const dbGuild = await Guild.findOne({ where: { id: guildId } });

      if (dbGuild) {
        // Update the welcome role ID
        await dbGuild.update({ welcomeRoleId: role.id });
      } else {
        // Create a new guild entry if it doesn't exist
        await Guild.create({ id: guildId, welcomeRoleId: role.id });
      }

      // Send confirmation
      await interaction.reply(`Welcome role successfully set to ${role.name}!`);
    } catch (error) {
      console.error("Error setting the welcome role:", error);
      await interaction.reply({
        content: "An error occurred while setting the welcome role.",
        ephemeral: true,
      });
    }
  },
  options: {
    devOnly: false,
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false,
  },
};
