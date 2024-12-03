const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout_remove')
        .setDescription('Remove a timeout from a member.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) 
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The member to remove the timeout from')
                .setRequired(true)),

    async execute(interaction) {
        const member = interaction.options.getMember('member');

        // Check if the member exists and is timed out
        if (!member) {
            return interaction.reply({ content: 'The specified member could not be found.', ephemeral: true });
        }

        if (!member.communicationDisabledUntil) {
            return interaction.reply({ content: 'This member is not currently timed out.', ephemeral: true });
        }

        try {
            // Remove the timeout
            await member.timeout(null);

            // Confirmation Embed
            const timeoutRemoveEmbed = new EmbedBuilder()
                .setColor(0x00ff00) // green
                .setTitle('Timeout Removed')
                .addFields(
                    { name: 'Member', value: `${member.user.tag}`, inline: true }
                )
                .setFooter({ text: `Action performed by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [timeoutRemoveEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ An error occurred while trying to remove the timeout.',
                ephemeral: true
            });
        }
    },
};
