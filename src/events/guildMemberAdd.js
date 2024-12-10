const { execute } = require('../commands/misc/setWelcomeRole');
const Guild = require('../models/guild');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const dbGuild = await Guild.findOne({where: {id: member.guild.id}});

        if(dbGuild.welcomeRoleId) {
            const welcomeRole = await member.guild.roles.fetch(dbGuild.welcomeRoleId);
            await member.roles.add(welcomeRole);
        }
    }
}