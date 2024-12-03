const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout_add')
        .setDescription('Timeout a member for a specified duration.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) 
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The member to timeout.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('duration')
                .setDescription('Timeout duration (e.g., 10m for minutes, 2h for hours, etc.).')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the timeout.')
                .setRequired(false))
        .addBooleanOption(option =>
            option
                .setName('dm_member')
                .setDescription('DM the member?')
                .setRequired(false)),
    
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const durationInput = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const dmMember = interaction.options.getBoolean('dm_member') || false;

        if (!member) {
            return interaction.reply({ content: 'The member could not be found or is not in this server.', ephemeral: true });
        }

        if (!member.moderatable) {
            return interaction.reply({ content: 'Cannot timeout this member, check my permissions.', ephemeral: true });
        }

        // Parse duration input
        const durationRegex = /^(\d+)([smhdwy]?)$/i;
        const match = durationInput.match(durationRegex);

        if (!match) {
            return interaction.reply({ content: 'Invalid duration format. Use a number followed by a unit (e.g., 10m, 2h, 1d, etc.).', ephemeral: true });
        }

        const value = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();

        // Calculate duration in milliseconds
        let durationMs;
        switch (unit) {
            case 's': durationMs = value * 1000; break; // seconds
            case 'm': durationMs = value * 60 * 1000; break; // minutes
            case 'h': durationMs = value * 60 * 60 * 1000; break; // hours
            case 'd': durationMs = value * 24 * 60 * 60 * 1000; break; // days
            case 'w': durationMs = value * 7 * 24 * 60 * 60 * 1000; break; // weeks
            case 'y': durationMs = value * 365 * 24 * 60 * 60 * 1000; break; // years
            default: durationMs = 0; break; // Shouldn't happen as regex ensures format
        }

        if (durationMs <= 0) {
            return interaction.reply({ content: 'Invalid duration. Use a positive number with valid units.', ephemeral: true });
        }

        try {
            // DM the member if the option is enabled
            if (dmMember) {
                const dmEmbed = new EmbedBuilder()
                    .setColor(0xffa500) // orange
                    .setTitle('You have been Timed Out!')
                    .addFields(
                        { name: 'Duration', value: `${value}${unit}`, inline: true },
                        { name: 'Reason', value: reason, inline: false }
                    )
                    .setFooter({ text: 'Contact a moderator if you have questions.' })
                    .setTimestamp();

                await member.send({ embeds: [dmEmbed] }).catch(() => {
                    console.log(`Could not send a DM to ${member.user.tag}.`);
                });
            }

            // Apply the timeout
            await member.timeout(durationMs, reason);

            // Log the timeout action
            const timeoutAddEmbed = new EmbedBuilder()
                .setColor(0xff0000) // red
                .setTitle('Member Timed Out')
                .addFields(
                    { name: 'Member', value: `${member.user.tag}`, inline: true },
                    { name: 'Duration', value: `${value}${unit}`, inline: true },
                    { name: 'Reason', value: reason, inline: true }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: `Action performed by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await interaction.reply({ embeds: [timeoutAddEmbed] });

            // Automatically remove the timeout (if timeout isn't permanent)
            setTimeout(async () => {
                try {
                    await member.timeout(null); // Remove timeout
                    console.log(`Timeout expired for ${member.user.tag} after ${value}${unit}.`);
                } catch (error) {
                    console.error(`Failed to remove timeout for ${member.user.tag}:`, error);
                }
            }, durationMs);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ An error occurred while trying to timeout the member.',
                ephemeral: true
            });
        }
    },
};
