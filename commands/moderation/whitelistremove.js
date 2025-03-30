const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const whitelistFile = path.join(__dirname, '../../whitelist.txt');
const logsFile = path.join(__dirname, '../../whitelistlogs.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whitelistremove')
        .setDescription('Removes a username from the whitelist')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('username')
            .setDescription('The username to remove')
            .setRequired(true)
        ),
    async execute(interaction) {
        const usernameToRemove = interaction.options.getString('username');
        if (!fs.existsSync(logsFile)) {
            return interaction.reply({ content: 'The whitelist log does not exist.', ephemeral: true });
        }
        let logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
        const userId = Object.keys(logs).find(id => logs[id] === usernameToRemove);

        if (!userId) {
            return interaction.reply({ content: `Username **${usernameToRemove}** not found in the whitelist.`, ephemeral: true });
        }
        delete logs[userId];

        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
        if (fs.existsSync(whitelistFile)) {
            let whitelistEntries = fs.readFileSync(whitelistFile, 'utf8').split('\n').filter(line => line.trim() !== '');
            whitelistEntries = whitelistEntries.filter(line => line !== usernameToRemove);
            fs.writeFileSync(whitelistFile, whitelistEntries.join('\n') + '\n', 'utf8');
        }

        await interaction.reply({ content: `✅ Username **${usernameToRemove}** has been removed from the whitelist.`, ephemeral: true });
    }
};
