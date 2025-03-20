const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { blue } = require('../colors.json');
const config = require('../config.json');

module.exports = {
    name: Events.GuildRoleUpdate,
    async execute(oldRole, newRole) {
        console.log(`GuildRoleUpdate triggered for role: ${newRole.name} (${newRole.id})`);
        const channelId = config.logChannels.roleLogs;
        const channel = newRole.guild.channels.cache.get(channelId) || newRole.guild.channels.cache.find(ch => ch.name === 'logs');
        if (!channel || !channel.permissionsFor(newRole.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
            console.log('Log channel not found or bot lacks permission to send messages.');
            return;
        }
        let changes = [];
        const oldPerms = new PermissionsBitField(oldRole.permissions.bitfield);
        const newPerms = new PermissionsBitField(newRole.permissions.bitfield);
        const oldPermsList = Object.keys(oldPerms.serialize()).filter(perm => oldPerms.has(perm));
        const newPermsList = Object.keys(newPerms.serialize()).filter(perm => newPerms.has(perm));
        const addedPerms = newPermsList.filter(perm => !oldPermsList.includes(perm));
        const removedPerms = oldPermsList.filter(perm => !newPermsList.includes(perm));

        if (addedPerms.length > 0) {
            changes.push(`**Added Permissions:** \`${addedPerms.join('`, `')}\``);
        }
        if (removedPerms.length > 0) {
            changes.push(`**Removed Permissions:** \`${removedPerms.join('`, `')}\``);
        }
        if (oldRole.name !== newRole.name) {
            changes.push(`**Name Changed:** \`${oldRole.name}\` → \`${newRole.name}\``);
        }
        if (oldRole.color !== newRole.color) {
            changes.push(`**Color Changed:** \`#${oldRole.color.toString(16)}\` → \`#${newRole.color.toString(16)}\``);
        }
        if (oldRole.hoist !== newRole.hoist) {
            changes.push(`**Displayed Separately:** \`${oldRole.hoist}\` → \`${newRole.hoist}\``);
        }
        if (oldRole.mentionable !== newRole.mentionable) {
            changes.push(`**Mentionable:** \`${oldRole.mentionable}\` → \`${newRole.mentionable}\``);
        }
        if (oldRole.position !== newRole.position) {
            changes.push(`**Position Changed:** \`${oldRole.position}\` → \`${newRole.position}\``);
        }

        if (changes.length === 0) {
            console.log('No relevant changes detected.');
            return;
        }

        let executor = "Unknown User";
        try {
            const fetchedLogs = await newRole.guild.fetchAuditLogs({
                type: 31,
                limit: 1
            });
            const auditEntry = fetchedLogs.entries.first();

            if (auditEntry && auditEntry.target.id === newRole.id) {
                executor = `<@${auditEntry.executor.id}>`;
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        }

        const logEmbed = new EmbedBuilder()
            .setTitle(`Role Updated: ${newRole.name}`)
            .setDescription(`**Edited by:** ${executor}\n\n${changes.join("\n")}`)
            .setColor(blue)
            .setTimestamp();

        await channel.send({ embeds: [logEmbed] });
        console.log('Embed sent successfully.');
    }
};
