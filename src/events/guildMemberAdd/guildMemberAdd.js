const Guild = require('../../models/guild');

// module.exports = async (member, client) => {
//   // Find a role named "Member" and add it to the new member
//   const welcomeRole = member.guild.roles.cache.find(role => role.name === 'Member');
//   if (welcomeRole) {
//     await member.roles.add(welcomeRole).catch(console.error);
//   }

//   // Fetch guild settings from the database
//   const dbGuild = await Guild.findOne({ where: { id: member.guild.id } });
  
//   if (dbGuild?.welcomeRoleId) {
//     const dbWelcomeRole = await member.guild.roles.fetch(dbGuild.welcomeRoleId).catch(console.error);
//     if (dbWelcomeRole) {
//       await member.roles.add(dbWelcomeRole).catch(console.error);
//     }
//   }
// };

module.exports = async (member, client) => {
  console.log("guildMemberAdd event triggered.");

  try {
    console.log(`Member ${member.user.tag} joined the server ${member.guild.name}.`);

    const dbGuild = await Guild.findOne({ where: { id: member.guild.id } });
    if (!dbGuild) {
      console.log(`No database entry found for guild ${member.guild.id}.`);
      return;
    }

    console.log(`Database entry found for guild: ${member.guild.id}`);

    if (!dbGuild.welcomeRoleId) {
      console.log(`No welcome role set for guild ${member.guild.id}.`);
      return;
    }

    console.log(`Fetching welcome role with ID: ${dbGuild.welcomeRoleId}`);
    
    let welcomeRole = member.guild.roles.cache.get(dbGuild.welcomeRoleId);
    
    if (!welcomeRole) {
      console.log(`Welcome role not cached, trying to fetch...`);
      welcomeRole = await member.guild.roles.fetch(dbGuild.welcomeRoleId);
    }

    if (!welcomeRole) {
      console.log(`Failed to find welcome role with ID: ${dbGuild.welcomeRoleId}`);
      return;
    }

    console.log(`Welcome role found: ${welcomeRole.name}. Attempting to assign to ${member.user.tag}.`);

    await member.roles.add(welcomeRole);
    console.log(`Successfully assigned welcome role ${welcomeRole.name} to ${member.user.tag}.`);

  } catch (error) {
    console.error("Error assigning welcome role:", error);
  }
};

