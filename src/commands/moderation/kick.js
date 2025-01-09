const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("kick")
      .setDescription("Kick-related actions.")
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
      .addSubcommand((subcommand) =>
        subcommand
          .setName("add")
          .setDescription("Kicks a member from the server.")
          .addUserOption((option) =>
            option
              .setName("user")
              .setDescription("The member to kick.")
              .setRequired(true)
          )
          .addStringOption((option) =>
            option
              .setName("reason")
              .setDescription("Reason for the kick.")
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName("dm_member")
              .setDescription("DM the member?")
              .setRequired(false)
          )
      ),
  
    run: async ({ interaction }) => {
      const subcommand = interaction.options.getSubcommand();
  
      if (subcommand === "add") {
        const member = interaction.options.getMember("user");
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
              "I cannot kick this member. Check my permissions and role hierarchy.",
            ephemeral: true,
          });
        }
  
        try {
          // DM the member if the option is enabled
          if (dmMember) {
            const dmEmbed = new EmbedBuilder()
              .setColor(0xffa500) // orange
              .setTitle(`You have been kicked from ${interaction.guild.name}!`)
              .addFields(
                { name: "Reason", value: reason, inline: false }
              )
              .setFooter({ text: "Contact a moderator if you have questions." })
              .setTimestamp();
  
            await member.send({ embeds: [dmEmbed] }).catch(() => {
              console.log(`Could not send a DM to ${member.user.tag}.`);
            });
          }
  
          // Kick the member
          await member.kick(reason);
  
          // Log the action
          const kickAddEmbed = new EmbedBuilder()
            .setColor(0xff0000) // red
            .setTitle("Member Kicked")
            .addFields(
              { name: "Member", value: `${member.user.tag}`, inline: true },
              { name: "Reason", value: reason, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({
              text: `Action performed by ${interaction.user.tag}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();
  
          await interaction.reply({ embeds: [kickAddEmbed] });
  
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: "❌ An error occurred while trying to kick the member.",
            ephemeral: true,
          });
        }
      }
    },
  
    options: {
      devOnly: true,
      userPermissions: ["KickMembers"],
      botPermissions: ["KickMembers"],
      deleted: false,
    },
  };
  