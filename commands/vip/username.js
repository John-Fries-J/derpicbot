const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { blue } = require('../../colors.json');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const whitelistFile = path.join(__dirname, '../../whitelist.json');
const logsFile = path.join(__dirname, '../../whitelistlogs.json');
function formatUUID(uuid) {
	return uuid.replace(
		/^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
		'$1-$2-$3-$4-$5'
	);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('username')
		.setDescription('Allows the VIP to submit their username for whitelist')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('Your Minecraft username')
				.setRequired(true)
		),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has('1319434671934935210') && !interaction.member.roles.cache.has('1393092761452019813')) {
			return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
		}

		const userId = interaction.user.id;
		const newUsername = interaction.options.getString('username');
		const mojangRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${newUsername}`);
		if (!mojangRes.ok) {
			return interaction.reply({ content: '❌ That username does not exist on Mojang\'s servers.', ephemeral: true });
		}
		const data = await mojangRes.json();
		const rawUuid = data.id;
		const uuid = formatUUID(rawUuid);

		if (!fs.existsSync(logsFile)) {
			fs.writeFileSync(logsFile, JSON.stringify({}), 'utf8');
		}
		if (!fs.existsSync(whitelistFile)) {
			fs.writeFileSync(whitelistFile, JSON.stringify([], null, 2), 'utf8');
		}
		let logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
let whitelistEntries;
try {
	const fileContent = fs.readFileSync(whitelistFile, 'utf8');
	whitelistEntries = JSON.parse(fileContent);
	if (!Array.isArray(whitelistEntries)) whitelistEntries = [];
} catch (err) {
	whitelistEntries = [];
}
		const existingIndex = whitelistEntries.findIndex(entry => entry.uuid === (logs[userId]?.uuid));
		if (existingIndex !== -1) {
			whitelistEntries[existingIndex] = { uuid, name: newUsername };
		} else {
			whitelistEntries.push({ uuid, name: newUsername });
		}

		logs[userId] = { username: newUsername, uuid };

		fs.writeFileSync(whitelistFile, JSON.stringify(whitelistEntries, null, 2), 'utf8');
		fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');

        const avatarUrl = `https://crafatar.com/avatars/${uuid}`;
        
        const embed = new EmbedBuilder()
            .setTitle('Whitelist Submission!')
            .setDescription(`**Minecraft Username:** \`${newUsername}\`\n**UUID:** \`${uuid}\``)
            .setColor(blue)
            .setTimestamp()
            .setThumbnail(avatarUrl)
            .setFooter({ text: `Requested by ${interaction.user.tag}` });
        

		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};