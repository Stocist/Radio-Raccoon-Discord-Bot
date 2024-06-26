"use strict";
//@ts-check

const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * @type {import('../types').ICommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Stops the music and leaves the voice channel."),
  async execute(param) {
    const { client, interaction } = param;
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: "There is no music currently playing.",
        ephemeral: true,
      });
    }

    queue.destroy(); // This stops the music and clears the queue
    interaction.reply({
      content: "Music has been stopped and the bot has left the voice channel.",
    });
  },
};
