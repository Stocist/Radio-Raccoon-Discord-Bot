const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription('Replies with "Pong!"'),
  /**
   *
   * @param {import("../types/index.d").IExecuteParameter} param
   * @returns {import("../types/index.d").TExecuteReturn<void>}
   */
  async execute(param) {
    const { client, interaction } = param;
    await interaction.reply("Pong!");
  },
};
