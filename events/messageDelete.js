const { Events, EmbedBuilder } = require('discord.js');
const { blue } = require('../colors.json');
const config = require('../config.json');

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (!message.guild || message.author?.bot) return;

        const channelId = config.logChannels?.messageDelete;
        const channel = message.guild.channels.cache.get(channelId) || message.guild.channels.cache.find(ch => ch.name === 'logs');
        if (!channel) {
            console.warn('Logging channel not found for message deletion.');
            return;
        }

        const messageContent = message.content || '[No content]';
        let deleter = 'Unknown or self-deleted';

        try {
            await new Promise(resolve => setTimeout(resolve, 4000));

            const fetchedLogs = await message.guild.fetchAuditLogs({
                type: 72,
                limit: 5
            });
            const deletionLog = fetchedLogs.entries.find(entry => {
                console.log(
                    `Checking log: Executor ${entry.executor.id}, Target ${entry.target.id} (Message Author: ${message.author.id})`
                );

                return (
                    entry.target.id === message.author.id &&
                    (Date.now() - entry.createdTimestamp) < 10000
                );
            });

            if (deletionLog) {
                deleter = `<@${deletionLog.executor.id}>`;
            } else {
                console.warn("No matching audit log entry found.");
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }

        const logEmbed = new EmbedBuilder()
            .setTitle(`Message deleted in #${message.channel.name}`)
            .setDescription(
                `**Author:** ${message.author.tag}\n` +
                `**Message:** ${messageContent}\n` +
                `**Deleted by:** ${deleter}\n` +
                `**Location:** [Jump to message](${message.url})`
            )
            .setColor(blue)
            .setTimestamp();

        try {
            await channel.send({ embeds: [logEmbed] });
        } catch (error) {
            console.error('Error sending log message:', error);
        }
    }
};
