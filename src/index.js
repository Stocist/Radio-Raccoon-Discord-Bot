require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// This initializes the player and attaches it to the client

client.login(process.env.TOKEN);

//Load commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandsFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if (!command.data || !command.data.name) {
    console.error(
      `Error loading command in ${file}: command is not properly formatted.`
    );
    continue; // Skip this command and move to the next
  }

  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

client.player = new Player(client);

client.on("ready", () => {
  const guild_ids = client.guilds.cache.map((guild) => guild.id);

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  for (const guildId of guild_ids) {
    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
        body: commands,
      })
      .then(() =>
        console.log("Successfully updated commands for guild " + guildId)
      )
      .catch(console.error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "An error occurred while executing that command.",
    });
  }
});
