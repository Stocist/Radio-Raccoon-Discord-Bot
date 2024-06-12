const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song."),
  async execute(interaction) {
    const { client } = interaction;
    const queue = client.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      await interaction.reply({
        content: "There is no music currently playing.",
        ephemeral: true,
      });
    }

    const currentTrack = queue.current;
    const success = queue.skip();

    if (success) {
      await interaction.reply({
        content: `Skipped **${currentTrack.title}**!`,
      });
    } else {
      await interaction.reply({
        content: "Something went wrong when trying to skip the song.",
        ephemeral: true,
      });
    }
  },
};
