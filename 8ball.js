const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Gives a random answer to a yes/no question.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The yes/no question to ask the magic 8-ball")
        .setRequired(true)
    ),
  run: async ({ interaction }) => {
    const responses = [
      "It is certain.",
      "Without a doubt.",
      "You may rely on it.",
      "Yes, definitely.",
      "It is decidedly so.",
      "As I see it, yes.",
      "Most likely.",
      "Yes.",
      "Outlook good.",
      "Signs point to yes.",
      "Ask again later.",
      "Don't count on it.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Very doubtful.",
    ];

    const question = interaction.options.getString("question");
    const response = responses[Math.floor(Math.random() * responses.length)];

    await interaction.reply(`🎱 You asked: "${question}"\n${response}`); // Replies to the interaction with the 8-ball response and the question
  },
  options: {
    devOnly: false,
    deleted: false,
  },
};
