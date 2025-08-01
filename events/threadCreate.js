const { Events, EmbedBuilder } = require('discord.js');
const { blue } = require('../colors.json');
const config = require('../config.json');

module.exports = {
    name: Events.ThreadCreate,
    async execute(thread) {
        const channelId = config.logChannels.threadCreate;
        const channel = thread.guild.channels.cache.get(channelId) || thread.guild.channels.cache.find(ch => ch.name === 'logs');
        
        if (!channel) {
            console.warn('Log channel not found');
            return;
        }
        const logEmbed = new EmbedBuilder()
            .setTitle(`Thread created`)
            .setDescription(`Thread ${thread.parent.name} was created by <@${thread.ownerId}>`)
            .setColor(blue)
            .setTimestamp();
        await channel.send({ embeds: [logEmbed] });
    }
};
