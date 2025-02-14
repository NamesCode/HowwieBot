const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Level = require("../../models/level");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your or someone else's level.")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The user whose level you want to see.")
        .setRequired(false)
    ),

  run: async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const { options, guild } = interaction;
    const targetUser = options.getMember("member") || interaction.member;

    const embed = new EmbedBuilder();

    try {
      const fetchedLevel = await Level.findOne({
        where: { userId: targetUser.id, guildId: guild.id },
      });

      if (!fetchedLevel) {
        embed
          .setColor("Red")
          .setDescription(`${targetUser} has no level data yet.`);
        return interaction.editReply({ embeds: [embed] });
      }

      const allLevels = await Level.findAll({
        where: { guildId: guild.id },
        attributes: ["userId", "level", "xp"],
      });

      allLevels.sort((a, b) => {
        if (a.level === b.level) return b.xp - a.xp;
        return b.level - a.level;
      });

      const currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUser.id) + 1;

      embed
        .setColor("Blue")
        .setAuthor({ name: targetUser.user.tag, iconURL: targetUser.user.displayAvatarURL() })
        .setTitle(`${targetUser.user.username}'s Level`)
        .setDescription(`**Level:** ${fetchedLevel.level}\n**XP:** ${fetchedLevel.xp}\n**Rank:** ${currentRank} in the server.`);

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching level data:", error);
      embed
        .setColor("Red")
        .setDescription("There was an error while fetching the level data.");
      return interaction.editReply({ embeds: [embed] });
    }
  },

  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false,
  },
};
