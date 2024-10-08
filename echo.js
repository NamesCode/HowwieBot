const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Echoes the input back to the user.')
        .addStringOption(option => 
            option.setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)),
    run: async ({ interaction }) => {
        const input = interaction.options.getString('input');
        await interaction.deferReply(); // Defers the reply to acknowledge the interaction
        interaction.deleteReply(); // Deletes the deferred reply
        interaction.channel.send(input); // Sends the input as a new message to the channel
    },
    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },
};
