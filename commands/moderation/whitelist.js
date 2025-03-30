const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelist')
        .setDMPermission(false)
        .setDescription('Sends the whitelist.txt'),
    async execute(interaction) {
		if (!interaction.member.roles.cache.has('1346690872661770311') && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
			return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		}

        const filePath = path.join(__dirname, '../../whitelist.txt');

        if (!fs.existsSync(filePath)) {
            return await interaction.reply({ content: 'Whitelist file does not exist.', ephemeral: true });
        }
        await interaction.reply({ content: 'Here is the whitelist file:', files: [filePath] });
    }
};