const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const whitelistFile = path.join(__dirname, '../whitelist.json');
const logsFile = path.join(__dirname, '../whitelistlogs.json');

function formatUUID(uuid) {
    return uuid.replace(
        /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
        '$1-$2-$3-$4-$5'
    );
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton() && interaction.customId === 'whitelist_button') {

            const modal = new ModalBuilder()
                .setCustomId('whitelist_modal')
                .setTitle('Minecraft Whitelist Submission');

            const usernameInput = new TextInputBuilder()
                .setCustomId('minecraft_username')
                .setLabel('Your Minecraft Username')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(usernameInput);
            modal.addComponents(row);

            await interaction.showModal(modal);
        } else if (interaction.isModalSubmit() && interaction.customId === 'whitelist_modal') {
            const userId = interaction.user.id;
            const newUsername = interaction.fields.getTextInputValue('minecraft_username');

            const mojangRes = await fetch(`https://api.mojang.com/users/profiles/minecraft/${newUsername}`);
            if (!mojangRes.ok) {
                return interaction.reply({ content: '❌ That username does not exist on Mojang\'s servers.', ephemeral: true });
            }
            const data = await mojangRes.json();
            const rawUuid = data.id;
            const uuid = formatUUID(rawUuid);

            try {
                if (!fs.existsSync(logsFile)) {
                    fs.writeFileSync(logsFile, JSON.stringify({}, null, 2), 'utf8');
                }

                if (!fs.existsSync(whitelistFile)) {
                    fs.writeFileSync(whitelistFile, JSON.stringify([], null, 2), 'utf8');
                }

                let logs = {};
                try {
                    const logsContent = fs.readFileSync(logsFile, 'utf8');
                    if (logsContent.trim()) {
                        logs = JSON.parse(logsContent);
                        if (typeof logs !== 'object' || Array.isArray(logs)) {
                            console.warn(`Logs file (${logsFile}) is not an object. Resetting to empty object.`);
                            logs = {};
                        }
                    }
                } catch (err) {
                    console.error(`Error reading/parsing logs file (${logsFile}):`, err);
                    return interaction.reply({ content: '❌ Error accessing logs file. Please try again later.', ephemeral: true });
                }

                let whitelistEntries = [];
                try {
                    const whitelistContent = fs.readFileSync(whitelistFile, 'utf8');
                    if (whitelistContent.trim()) {
                        whitelistEntries = JSON.parse(whitelistContent);
                        if (!Array.isArray(whitelistEntries)) {
                            console.warn(`Whitelist file (${whitelistFile}) is not an array. Resetting to empty array.`);
                            whitelistEntries = [];
                        }
                    }
                } catch (err) {
                    console.error(`Error reading/parsing whitelist file (${whitelistFile}):`, err);
                    return interaction.reply({ content: '❌ Error accessing whitelist file. Please try again later.', ephemeral: true });
                }

                const existingIndex = whitelistEntries.findIndex(entry => entry.uuid === (logs[userId]?.uuid));
                if (existingIndex !== -1) {
                    whitelistEntries[existingIndex] = { uuid, name: newUsername };
                } else {
                    whitelistEntries.push({ uuid, name: newUsername });
                }

                logs[userId] = { username: newUsername, uuid };

                try {
                    fs.writeFileSync(whitelistFile, JSON.stringify(whitelistEntries, null, 2), 'utf8');
                    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2), 'utf8');
                } catch (err) {
                    return interaction.reply({ content: '❌ Error saving whitelist data. Please try again later.', ephemeral: true });
                }


                const avatarUrl = `https://crafatar.com/avatars/${uuid}`;
                const embed = new EmbedBuilder()
                    .setTitle('Whitelist Submission!')
                    .setDescription(`**Minecraft Username:** \`${newUsername}\`\n**UUID:** \`${uuid}\``)
                    .setColor(0x00FF00)
                    .setTimestamp()
                    .setThumbnail(avatarUrl)
                    .setFooter({ text: `Requested by ${interaction.user.tag}` });

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (err) {
                console.error('Unexpected error during whitelist processing:', err);
                return interaction.reply({ content: '❌ An unexpected error occurred. Please try again later.', ephemeral: true });
            }
        }
    },
};