const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Infraction = require('../../models/infraction');
const Member = require('../../models/member');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(option => 
            option.setName('member')
                .setDescription('Member being warned')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for warning the user')
                .setRequired(false)
                .setMinLength(1)
                .setMaxLength(255)
        ),

    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        const { options, guild, user } = interaction;

        const target = await options.getMember('member'); 
        let reason = await options.getString('reason') || 'No reason provided';

        let embed = new EmbedBuilder();

        try {
            const [member, created] = await Member.findOrCreate({
                where: { id: target.id, guildId: guild.id },
            });

            const infraction = await member.createInfraction({
                guildId: guild.id,
                reason: reason,
                type: 'warn',
                enforcerId: user.id,
            });

            embed
                .setColor('Red')
                .setAuthor({ name: target.user.tag, iconURL: target.user.displayAvatarURL() })
                .setTitle('New Infraction')
                .setDescription(`Issued by ${user.tag}`)
                .addFields(
                    { name: 'ID:', value: `\`${infraction.id}\``, inline: true },
                    { name: 'Type:', value: `\`${infraction.type}\``, inline: true },
                    { name: 'Guild:', value: `\`${guild.name}\``, inline: true },
                    { name: 'Reason:', value: `\`${infraction.reason}\``, inline: true },
                );

        } catch (error) {
            console.error(error);
            embed
                .setColor('Red')
                .setDescription('An error occurred while creating the infraction.');
        }

        await interaction.editReply({ embeds: [embed] });
    },
    options: {
        devOnly: true,
        userPermissions: ["ModerateMembers"],
        botPermissions: ["ModerateMembers"],
        deleted: false,
      },
};
