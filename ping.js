const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong'),
    run: ({ interaction }) => {
        interaction.reply(`🏓 Pong! ${interaction.client.ws.ping}ms`);
    },
    options: {
        devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false,
    },
};
