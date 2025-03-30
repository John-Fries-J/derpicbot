const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blue } = require('../../colors.json');
const fs = require('fs');
const path = require('path');

const whitelistFile = path.join(__dirname, '../../whitelist.txt');
const logsFile = path.join(__dirname, '../../whitelistlogs.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('username')
		.setDescription('Allows the VIP to submit their username for whitelist')
		.addStringOption(option => 
			option.setName('username')
			.setDescription('Your username')
			.setRequired(true)
		),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has('1319434671934935210')) {
			return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		}

		const userId = interaction.user.id;
		const newUsername = interaction.options.getString('username');
		if (!fs.existsSync(logsFile)) {
			fs.writeFileSync(logsFile, JSON.stringify({}), 'utf8');
		}
		let logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
		let whitelistEntries = [];
		if (fs.existsSync(whitelistFile)) {
			whitelistEntries = fs.readFileSync(whitelistFile, 'utf8').split('\n').filter(line => line.trim() !== '');
		}
		if (logs[userId]) {
			const oldUsername = logs[userId];
			whitelistEntries = whitelistEntries.map(line => (line === oldUsername ? newUsername : line));
			logs[userId] = newUsername;
		} else {
			whitelistEntries.push(newUsername);
			logs[userId] = newUsername;
		}
		fs.writeFileSync(whitelistFile, whitelistEntries.join('\n') + '\n', 'utf8');
		fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
		const embed = new EmbedBuilder()
			.setTitle('Whitelist Submission!')
			.setDescription(`**Username submitted**:\n# ${newUsername}`)
			.setColor(blue)
			.setTimestamp()
			.setThumbnail(interaction.guild.iconURL())
			.setFooter({ text: `Requested by ${interaction.user.tag}` });

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
