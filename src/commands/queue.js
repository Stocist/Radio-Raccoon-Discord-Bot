const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current music queue.'),
    async execute(interaction) {
        const { client } = interaction;
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || queue.tracks.length === 0) {
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription("There are no songs currently in the queue.")],
                ephemeral: true
            });
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        let page = 0;

        const generateEmbed = (currentPage) => {
            const start = currentPage * 10;
            const end = start + 10;
            const currentTracks = queue.tracks.slice(start, end);

            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Music Queue - Page ${currentPage + 1} of ${totalPages}`)
                .setDescription(currentTracks.map((track, index) => `${start + index + 1}. **${track.title}** - Requested by: **${track.requestedBy.username}**`).join('\n'))
                .setFooter({ text: `There are ${queue.tracks.length} song(s) in total in the queue.` });

            if (queue.current) {
                embed.addField('Now Playing', `**${queue.current.title}** - Requested by: **${queue.current.requestedBy.username}**`);
            }

            return embed;
        };

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previous')
                    .setLabel('Previous')
                    .setStyle('PRIMARY')
                    .setDisabled(page === 0),
                new MessageButton()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle('PRIMARY')
                    .setDisabled(page === totalPages - 1)
            );

        const message = await interaction.reply({ 
            embeds: [generateEmbed(page)], 
            components: [buttons], 
            fetchReply: true 
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'previous' && page > 0) {
                page--;
            } else if (i.customId === 'next' && page < totalPages - 1) {
                page++;
            }

            await i.update({ 
                embeds: [generateEmbed(page)],
                components: [new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('previous')
                        .setLabel('Previous')
                        .setStyle('PRIMARY')
                        .setDisabled(page === 0),
                    new MessageButton()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle('PRIMARY')
                        .setDisabled(page === totalPages - 1)
                )]
            });
        });

        collector.on('end', () => message.edit({ components: [] }));
    }
};
