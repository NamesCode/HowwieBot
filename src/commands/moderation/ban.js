const {SlashCommandBuilder,EmbedBuilder,PermissionFlagsBits,} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban-related actions.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Bans a member from the server.")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("The member to ban.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription(
              "Ban duration (e.g., 10m for minutes, 2h for hours, etc.). Set 0 for permanent."
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for the ban.")
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("dm_member")
            .setDescription("DM the member?")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Unbans a member from the server.")
        .addStringOption((option) =>
          option
            .setName("user_id")
            .setDescription("The user ID of the member to unban")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for unbanning the member")
            .setRequired(false)
        )
    ),

  run: async ({ interaction }) => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      const member = interaction.options.getMember("member");
      const durationInput = interaction.options.getString("duration");
      const reason =
        interaction.options.getString("reason") || "No reason provided";
      const dmMember = interaction.options.getBoolean("dm_member") || false;

      if (!member) {
        return interaction.reply({
          content: "The member could not be found or is not in this server.",
          ephemeral: true,
        });
      }

      if (!member.moderatable) {
        return interaction.reply({
          content:
            "I cannot ban this member. Check my permissions and role hierarchy.",
          ephemeral: true,
        });
      }

      // Parse duration input
      const durationRegex = /^(\d+)([smhdwy]?)$/i;
      const match = durationInput.match(durationRegex);

      if (!match) {
        return interaction.reply({
          content:
            "Invalid duration format. Use a number followed by a unit (e.g., 10m, 2h, 1d, etc.).",
          ephemeral: true,
        });
      }

      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      // Calculate duration in milliseconds
      let durationMs;
      switch (unit) {
        case "s":
          durationMs = value * 1000;
          break; // seconds
        case "m":
          durationMs = value * 60 * 1000;
          break; // minutes
        case "h":
          durationMs = value * 60 * 60 * 1000;
          break; // hours
        case "d":
          durationMs = value * 24 * 60 * 60 * 1000;
          break; // days
        case "w":
          durationMs = value * 7 * 24 * 60 * 60 * 1000;
          break; // weeks
        case "y":
          durationMs = value * 365 * 24 * 60 * 60 * 1000;
          break; // years
        default:
          durationMs = 0;
          break; // Permanent ban
      }

      if (durationMs === 0 && unit !== "") {
        return interaction.reply({
          content: "Invalid duration unit. Use s, m, h, d, w, or y.",
          ephemeral: true,
        });
      }

      try {
        // DM the member if the option is enabled
        if (dmMember) {
          const dmEmbed = new EmbedBuilder()
            .setColor(0xffa500) // orange
            .setTitle(`You have been banned from ${interaction.guild.name}!`)
            .addFields(
              {
                name: "Duration",
                value: unit ? `${value}${unit}` : "Permanent",
                inline: true,
              },
              { name: "Reason", value: reason, inline: false }
            )
            .setFooter({ text: "Contact a moderator if you have questions." })
            .setTimestamp();

          await member.send({ embeds: [dmEmbed] }).catch(() => {
            console.log(`Could not send a DM to ${member.user.tag}.`);
          });
        }

        // Ban the member
        await member.ban({ reason });

        // Log the action
        const banAddEmbed = new EmbedBuilder()
          .setColor(0xff0000) // red
          .setTitle("Member Banned")
          .addFields(
            { name: "Member", value: `${member.user.tag}`, inline: true },
            {
              name: "Duration",
              value: unit ? `${value}${unit}` : "Permanent",
              inline: true,
            },
            { name: "Reason", value: reason, inline: true }
          )
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({
            text: `Action performed by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        await interaction.reply({ embeds: [banAddEmbed] });

        // If the ban is temporary, unban the user after the specified duration
        if (durationMs > 0) {
          setTimeout(async () => {
            try {
              await interaction.guild.members.unban(
                member.user.id,
                "Ban duration expired."
              );
              console.log(`Unbanned ${member.user.tag} after ${value}${unit}.`);
            } catch (error) {
              console.error(`Failed to unban ${member.user.tag}:`, error);
            }
          }, durationMs);
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "❌ An error occurred while trying to ban the member.",
          ephemeral: true,
        });
      }
    } else if (subcommand === "remove") {
      const userId = interaction.options.getString("user_id");
      const reason =
        interaction.options.getString("reason") || "No reason provided";

      try {
        // Fetch the banned users list
        const banList = await interaction.guild.bans.fetch();
        const bannedUser = banList.get(userId);

        if (!bannedUser) {
          return interaction.reply({
            content: "This user is not banned.",
            ephemeral: true,
          });
        }

        // Unban the user
        await interaction.guild.members.unban(userId, reason);

        // Confirmation Embed
        const banRemove = new EmbedBuilder()
          .setColor(0x00ff00) // Green
          .setTitle("Member Unbanned")
          .addFields(
            { name: "User ID", value: `${userId}`, inline: true },
            { name: "Reason", value: reason, inline: false }
          )
          .setFooter({
            text: `Action performed by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTimestamp();

        await interaction.reply({ embeds: [banRemove] });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "❌ An error occurred while trying to unban the user. Please ensure the User ID is correct.",
          ephemeral: true,
        });
      }
    }
  },

  options: {
    devOnly: true,
    userPermissions: ["BanMembers"],
    botPermissions: ["BanMembers"],
    deleted: false,
  },
};
