const { roles, welcomeID, WelcomeEmbed } = require('../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        const channelId = welcomeID;
        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) { return console.error(`Channel with ID ${channelId} not found.`); }
        const embed = new EmbedBuilder()
            .setTitle(WelcomeEmbed.title)
            .setDescription(WelcomeEmbed.description.replace('${user}', member.user))
            .setThumbnail(WelcomeEmbed.thumbnail)
            .setFooter({ text: WelcomeEmbed.footer, iconURL: WelcomeEmbed.footerIcon })
            .setColor('#0099ff');
        channel.send({ embeds: [embed] });
        const roleIds = [
            roles.autoRoleId,
            roles.autoRoleId1,
            roles.autoRoleId2,
            roles.autoRoleId3
        ];

        roleIds.forEach(roleId => {
            if (member.roles.cache.has(roleId)) {
                return;
            } else {
                member.roles.add(roleId)
                    .then(() => console.info(`Added role: ${roleId} to user: ${member.user.tag}`))
                    .catch(err => console.error(`Failed to add role: ${roleId} to user: ${member.user.tag} - Error: ${err}`));
            }
        });
    },
};
