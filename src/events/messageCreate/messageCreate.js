const Level = require('../../models/level');

module.exports = async (message, client) => {
  console.log("messageCreate event triggered");

  // Ignore bot messages
  if (message.author.bot) {
    console.log("Bot message ignored");
    return;
  }

  console.log(`Message detected from ${message.author.tag} in ${message.guild.name}`);

  // Check if the user already has a level record
  let userLevel = await Level.findOne({ where: { userId: message.author.id, guildId: message.guild.id } });

  if (!userLevel) {
    // Create a new level record if it doesn't exist
    userLevel = await Level.create({
      userId: message.author.id,
      guildId: message.guild.id,
      level: 1,
      xp: 0
    });
    console.log(`Created new level record for ${message.author.tag}`);
  }

  // Add XP
  userLevel.xp += 10;

  // Calculate XP required to level up 
  const xpRequired = userLevel.level * 100;
  if (userLevel.xp >= xpRequired) {
    userLevel.level += 1;
    userLevel.xp = 0; // Reset XP after leveling up
    console.log(`${message.author.tag} leveled up to level ${userLevel.level}`);
  }

  // Save the updated level and XP
  await userLevel.save();
  console.log(`Updated level and XP for ${message.author.tag}`);
};
