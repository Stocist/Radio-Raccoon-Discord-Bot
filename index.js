const { Player } = require('discord-player');

const client = new Discord.Client({
    // Make sure you have 'GuildVoiceStates' intent enabled
    intents: ['GuildVoiceStates' /* Other intents */]
});

// this is the entrypoint for discord-player based application
const player = new Player(client);

// Now, lets load all the default extractors, except 'YouTubeExtractor'. You can remove the filter if you want to load all the extractors.
await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');