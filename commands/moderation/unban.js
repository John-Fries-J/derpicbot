const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { modRole } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server.')
        .setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription('The user to unban').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers) && !interaction.member.roles.cache.has(modRole)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.unban(user);
        await interaction.reply(`${member.tag} has been unbanned.`);
    },
};