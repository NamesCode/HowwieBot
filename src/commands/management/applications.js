const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const csvParser = require('csv-parser');
const https = require('https');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("render-apps")
    .setDescription("Renders applications or any other CSV file really.")
    .addAttachmentOption(
      (attachmentOption) => attachmentOption
        .setRequired(true)
        .setName("csv")
        .setDescription("The application spreadsheets CSV file. This can normally be found under export options.")
    ).addNumberOption(
      (numberOption) => numberOption
        .setName("after-row")
        .setDescription("Displays all applications after a row")
    ).addNumberOption(
      (numberOption) => numberOption
        .setName("before-row")
        .setDescription("Displays all applications before a row")
    ),
  run: ({ interaction }) => {
    const attachment = interaction.options.getAttachment("csv");
    let csvData = [];

    https.get(attachment.url, (response) => {
      // Check if the response is valid
      if (response.statusCode === 200) {
        // Pipe the data from the response to the file
        response.pipe(csvParser())
          .on("data", (row) => { csvData.push(row); })
          .on("error", (err) => {
            console.error('Error during parsing:', err);
            interaction.reply(`Error during parsing: ${err}`);
          })
          .on("end", () => {
            const skip = interaction.options.getNumber("after-row") ?? 0;
            const stop = interaction.options.getNumber("before-row") ?? csvData.length;

            for (let [index, row] of csvData.slice(skip, stop).entries()) {
              let embeds = [];
              const colour = Math.floor(Math.random() * 0xFFFFFF);

              const username = row["Discord Username"];
              delete row["Discord Username"];
              const submitted = Date.parse(row["Timestamp"]);
              delete row["Timestamp"];

              let embed = new EmbedBuilder()
                .setColor(colour)
                .setTitle(`${username}`)
                .setFooter({ text: `Submission #${index + 1 + skip}` })
                .setTimestamp(submitted);

              embeds.push(embed);

              for (let [key, value] of Object.entries(row)) {
                key = key || "Unknown";
                value = value || "N/A";

                // Size constraints because discord
                if (key.length > 50) {
                  key = key.slice(0, 47) + "...";
                };

                // Also because the mf's yap
                if (value.length > (200 - 16 - key.length)) {
                  value = value.slice(0, (200 - 16 - 3 - key.length)) + "...";
                };

                embed = new EmbedBuilder()
                  .setColor(colour)
                  .setTitle(`${key}`)
                  .setDescription(`${value}`)
                  .setFooter({ text: `Submission #${index + 1 + skip}` })

                if (embeds.length < 10) {
                  embeds.push(embed);
                } else {
                  interaction.channel.send({ embeds: embeds });
                  embeds = [];
                }
              }

              interaction.channel.send({ embeds: embeds });
            };
          });
      } else {
        console.error(`Failed to stream: ${response.statusCode}`);
        interaction.reply(`Failed to stream: ${response.statusCode}`);
      }
    }).on('error', (err) => {
      console.error('Error during the streaming:', err);
      interaction.reply(`Error during the streaming: ${err}`);
    });
  },
  options: {
    devOnly: true,
    userPermissions: ["Administrator"],
    botPermissions: ["Administrator"],
    deleted: false,
  },
};
