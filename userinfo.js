const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays information about a user.")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to get information about")
        .setRequired(false)
    ),
  run: async ({ interaction }) => {
    const user = interaction.options.getUser("target") || interaction.user;

    // Fetch the user from Discord's API to get more details
    const fetchedUser = await interaction.client.users.fetch(user.id);

    await interaction.deferReply(); // Defer the reply to acknowledge the interaction

    try {
      await interaction.editReply(
        `Username: ${fetchedUser.username}\nID: ${fetchedUser.id}`
      );
    } catch (error) {
      console.error(error);
      await interaction.followUp("Failed to fetch user information.");
    }
  },
  options: {
    devOnly: true, // Example: Set this to false if it's not a developer-only command
    userPermissions: ["ADMINISTRATOR"], // Example: Define required user permissions
    botPermissions: ["ADMINISTRATOR"], // Example: Define required bot permissions
    deleted: false, // Example: Whether to delete the command message after execution
  },
};
