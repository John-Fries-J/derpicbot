const { Client, Intents, EmbedBuilder } = require('discord.js');
const { statusName, logChannels } = require('../config.json');
const { green } = require('../colors.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.info(`Ready! Logged in as ${client.user.tag}`);
        const channelId = logChannels.logChannel;
        const channel = client.channels.cache.get(channelId);
        if (!channel) {
            console.warn('Log channel not found');
            return;
        }
        const logEmbed = new EmbedBuilder()
            .setTitle('Bot is ready')
            .setDescription('Bot is now online and ready to use')
            .setColor(green)
            .setTimestamp();
        channel.send({ embeds: [logEmbed] });
        if (!statusName) return console.error('No status name provided in config.json')
        else {
        client.user.setPresence({ activities: [{ name: `${statusName}` }] });
    }
    },
};
