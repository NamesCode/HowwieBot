const fs = require("node:fs");
const path = require("node:path");
const { CommandKit } = require("commandkit");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

const Infraction = require('../src/models/infraction');
const Member = require('../src/models/member');
const Level = require('../src/models/level');

Member.hasMany(Infraction);
Infraction.belongsTo(Member);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = getAllFiles(eventsPath);

for (const file of eventFiles) {
  console.log(`Loading event file: ${file}`);
  const event = require(file);

  if (typeof event === "function") {
    console.log(`Successfully loaded event: ${file}`);
  } else {
    console.warn(`Failed to load event: ${file}. It might not export a function.`);
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
}

new CommandKit({
  client,
  commandsPath: path.join(__dirname, 'commands'),  
  eventsPath: path.join(__dirname, 'events'),
  validationsPath: path.join(__dirname, 'validations'),  
  devGuildIds: ["1303141502876254233"],
  devUserIds: ["427120596674019329"],
  devRoleIds: ["1312551729392517151"],
  // skipBuiltInValidations: true,
  bulkRegister: true,
});

client.login(process.env.TOKEN);



// // When the client is ready, run this code (only once).
// // The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// // It makes some properties non-nullable.
// client.once(Events.ClientReady, (readyClient) => {
//   console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });

// // Log in to Discord with your client's token
// client.login(process.env.TOKEN);

// // Load commands into a hashmap
// client.commands = new Collection();

// const foldersPath = path.join(__dirname, "src", "commands");
// const commandFolders = fs.readdirSync(foldersPath);

// for (const folder of commandFolders) {
//   const commandsPath = path.join(foldersPath, folder);
//   const commandFiles = fs
//     .readdirSync(commandsPath)
//     .filter((file) => file.endsWith(".js"));
//   for (const file of commandFiles) {
//     const filePath = path.join(commandsPath, file);
//     const command = require(filePath);
//     // Set a new item in the Collection with the key as the command name and the value as the exported module
//     if ("data" in command && "execute" in command) {
//       client.commands.set(command.data.name, command);
//     } else {
//       console.log(
//         `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
//       );
//     }
//   }
// }

// // Tells us all the registered commands
// console.log(client.commands);

// // Listens to interactions
// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   const command = interaction.client.commands.get(interaction.commandName);

//   if (!command) {
//     console.error(`No command matching ${interaction.commandName} was found.`);
//     return;
//   }

//   try {
//     await command.execute(interaction);
//   } catch (error) {
//     console.error(error);
//     if (interaction.replied || interaction.deferred) {
//       await interaction.followUp({
//         content: "There was an error while executing this command!",
//         flags: MessageFlags.Ephemeral,
//       });
//     } else {
//       await interaction.reply({
//         content: "There was an error while executing this command!",
//         flags: MessageFlags.Ephemeral,
//       });
//     }
//   }
// });
