const { Events, EmbedBuilder } = require('discord.js');
const { blue } = require('../colors.json');
const config = require('../config.json');

module.exports = {
    name: Events.ThreadDelete,
    async execute(thread) {
        const channelId = config.logChannels.threadDelete;
        const channel = thread.guild.channels.cache.get(channelId) || thread.guild.channels.cache.find(ch => ch.name === 'logs');
        
        if (!channel) {
            console.warn('Log channel not found');
            return;
        }

        const logEmbed = new EmbedBuilder()
            .setTitle(`Thread deleted in ${thread.parent.name}`)
            .setDescription(`Thread deleted by <@${thread.ownerId}>`)
            .setColor(blue)
            .setTimestamp();
        await channel.send({ embeds: [logEmbed] });
    }
};
