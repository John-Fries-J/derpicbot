const { Events, EmbedBuilder } = require('discord.js');
const { blue } = require('../colors.json');
const config = require('../config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const channelId = `${config.logChannels.logChannel}`;
        const channel = interaction.guild.channels.cache.get(channelId) || interaction.guild.channels.cache.find(channel => channel.name === 'logs');
        
        if (!channel) {
            console.warn('Log channel not found please check your config.json');
            return;
        }

        if (interaction.isButton()) {
            if (interaction.channel.startsWith('ticket-')) {
                const ticketEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.user.tag} Clicked a button`)
                    .setDescription(`${interaction.user.tag} clicked a button in ${interaction.channel.name}`)
                    .setColor(blue)
                    .setTimestamp();
                channel.send({ embeds: [ticketEmbed] });
            } else {
                const logEmbed = new EmbedBuilder()
                    .setTitle(`${interaction.user.tag} Clicked a button`)
                    .setDescription(`${interaction.user.tag} clicked a button in ${interaction.channel.name}`)
                    .setColor(blue)
                    .setTimestamp();
            channel.send({ embeds: [logEmbed] });
            }
        } else if (interaction.isCommand()) {
            const logEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.tag} ran a command`)
                .setDescription(`Command ran in ${interaction.channel}, by ${interaction.user.tag}.\nCommand: ${interaction.commandName}\n[Go there](https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${interaction.id})`)
                .setColor(blue)
                .setTimestamp();
            channel.send({ embeds: [logEmbed] });
        }
    }
};
