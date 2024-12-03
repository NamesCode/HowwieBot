const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban_remove')
        .setDescription('Unban a member by their user ID.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option =>
            option
                .setName('user_id')
                .setDescription('The user ID of the member to unban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for unbanning the member')
                .setRequired(false)),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        try {
            // Fetch the banned users list
            const banList = await interaction.guild.bans.fetch();
            const bannedUser = banList.get(userId);

            if (!bannedUser) {
                return interaction.reply({ content: 'This user is not banned.', ephemeral: true });
            }

            // Unban the user
            await interaction.guild.members.unban(userId, reason);

            // Confirmation Embed
            const banRemove = new EmbedBuilder()
                .setColor(0x00ff00) // Green 
                .setTitle('Member Unbanned')
                .addFields(
                    { name: 'User ID', value: `${userId}`, inline: true },
                    { name: 'Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Action performed by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [banRemove] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ An error occurred while trying to unban the user. Please ensure the User ID is correct.',
                ephemeral: true
            });
        }
    },
};
