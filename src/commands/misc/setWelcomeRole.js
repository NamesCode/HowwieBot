const { SlashCommandBuilder } = require("discord.js");
const Guild = require("../../models/guild");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcomerole")
    .setDescription("Manage the role assigned to new members.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the role to assign to new members.")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to assign to new members.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clear")
        .setDescription("Clear the role assigned to new members.")
    ),
  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    try {
      const dbGuild = await Guild.findOne({ where: { id: guildId } });

      if (subcommand === "set") {
        const role = interaction.options.getRole("role");

        if (dbGuild) {
          await dbGuild.update({ welcomeRoleId: role.id });
        } else {
          await Guild.create({ id: guildId, welcomeRoleId: role.id });
        }

        await interaction.reply({
          content: `Welcome role successfully set to ${role.name}!`,
          ephemeral: true,
        });
      } else if (subcommand === "clear") {
        if (dbGuild && dbGuild.welcomeRoleId) {
          await dbGuild.update({ welcomeRoleId: null });
          await interaction.reply({
            content: "Welcome role has been cleared.",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "No welcome role is currently set.",
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error("Error managing the welcome role:", error);
      await interaction.reply({
        content: "An error occurred while managing the welcome role.",
        ephemeral: true,
      });
    }
  },
  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false,
  },
};
