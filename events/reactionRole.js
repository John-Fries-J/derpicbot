const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { roleMessageID, roleMappings } = require('../config.json');

module.exports = {
    name: Events.InteractionCreate,
    execute: async (interaction) => {
        if (!interaction.isButton()) return;

        const roleID = roleMappings[interaction.customId];
        if (!roleID) return;

        const role = interaction.guild.roles.cache.get(roleID);
        if (!role) {
            return interaction.reply({ content: "Role not found!", ephemeral: true });
        }

        const member = interaction.member;
        if (member.roles.cache.has(roleID)) {
            await member.roles.remove(role);
            return interaction.reply({ content: `Removed role: ${role.name}`, ephemeral: true });
        } else {
            await member.roles.add(role);
            return interaction.reply({ content: `Added role: ${role.name}`, ephemeral: true });
        }
    },
};
