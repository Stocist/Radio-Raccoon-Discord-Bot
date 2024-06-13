"use strict";
//@ts-check

const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * @type {import("../types/index").ICommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription('Replies with "Pong!"'),

  async execute(param) {
    const { client, interaction } = param;
    await interaction.reply("Pong!");
  },
};
