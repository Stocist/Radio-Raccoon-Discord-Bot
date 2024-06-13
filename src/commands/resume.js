"use strict";
//@ts-check
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

/**
 * @type {import("../types/index").ICommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("resumes the current song."),
  execute: async (param) => {
    const { client, interaction } = param;
    const queue = client.player.getQueue(interaction.guild);

    if (!queue) {
      await interaction.reply("There is no song playing.");
      return;
    }

    queue.setPaused(false);
    await interaction.reply("The current has been paused.");
  },
};
