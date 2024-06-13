"use strict";
//@ts-check

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

/**
 * @type {import("../types/index").ICommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Searches for a song.")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("search keywords")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Plays playlist from YT")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("URL of the playlist")
            .setRequired(true)
        )
    ),
  async execute(param) {
    const { client, interaction } = param;
    const subcommand = interaction.options.getSubcommand();
    const musicChannel = interaction.member.voice.channel;

    if (!musicChannel)
      return interaction.reply({
        content: "You need to be in a voice channel to play music!",
        ephemeral: true,
      });

    const queue = await client.player.nodes.create(interaction.guild);

    // Connect to the voice channel if not already connected
    if (!queue.connection) await queue.connect(musicChannel);

    if (subcommand === "search") {
      const searchTerms = interaction.options.getString("searchterms");
      const searchResult = await client.player.search(searchTerms, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      console.log(searchResult);

      if (!searchResult || !searchResult.tracks.length)
        return interaction.reply({
          content: "No results found!",
          ephemeral: true,
        });

      queue.addTrack(searchResult.tracks[0]);
      interaction.reply({
        content: `🎶 Playing **${searchResult.tracks[0].title}**!`,
      });
    } else if (subcommand === "playlist") {
      const playlistUrl = interaction.options.getString("url");
      const playlistResult = await client.player.search(playlistUrl, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (!playlistResult || !playlistResult.tracks.length)
        return interaction.reply({
          content: "No playlist found or it is empty!",
          ephemeral: true,
        });

      queue.addTracks(playlistResult.tracks);
      interaction.reply({
        content: `🎶 Playing playlist **${playlistResult.playlist.title}** with ${playlistResult.tracks.length} songs!`,
      });
    }

    // Start playing if not already
    if (!queue.playing) await queue.play();
  },
};
