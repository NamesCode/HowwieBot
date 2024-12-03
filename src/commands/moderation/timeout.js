const { SlashCommandBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member for a specified duration.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers) // Only those with Moderate Member perms can use this
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The member to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('duration')
                .setDescription('Timeout duration in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the timeout')
                .setRequired(false))
        .addBooleanOption(option =>
            option
                .setName('dm_member')
                .setDescription('DM the member?')
                .setRequired(false)),
    
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const dmMember = interaction.options.getBoolean('dm_member') || false;

        // Check if the user can be timed out
        if (!member) {
            return interaction.reply({ content: 'The member could not be found or is not in this server.', ephemeral: true });
        }

        if (!member.moderatable) {
            return interaction.reply({ content: 'I cannot timeout this member, check my permissions.', ephemeral: true });
        }

        // Convert minutes to milliseconds and apply timeout
        const timeoutDuration = duration * 60 * 1000;

        try {
            // creates embed for dm (if enabled)
            if (dmMember) {
                const dmEmbed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('You have been Timed Out')
                    .setDescription(`You have been timed out in **${interaction.guild.name}**.`)
                    .addFields(
                        { name: 'Duration', value: `${duration} minute(s)`, inline: true},
                        { name: 'Reason', value: reason, inline: false },
                    )
                    .setFooter({text: 'Contact a moderator if you have questions.' })
                    .setTimestamp();

                    await member.send({ embeds: [dmEmbed] }).catch(() => {
                        console.log(`could not send DM ${member.user.tag}.`);
                    });
            }
            
            await member.timeout(timeoutDuration, reason);

            // creates embed for log
            const logembed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Time out Result:')
            .addFields(
                { name: 'Member', value: `${member.user.tag}`, inline: true},
                { name: 'Duration', value: `${duration} minute(s)`, inline: true},
                { name: 'Reason', value: reason, inline: true},
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: `Action performed by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

            await interaction.reply({embeds: [logembed]});
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ An error occurred while trying to timeout the member.',
                ephemeral: true
            });
        }
    },
};
