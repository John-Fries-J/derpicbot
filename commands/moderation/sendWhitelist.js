const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { devs } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendwhitelist')
        .setDescription('Send a Minecraft whitelist submission message'),
    async execute(interaction) {
        if (!interaction.guild) return;
        if (!devs.includes(interaction.user.id)) return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('Minecraft Whitelist!')
            .setDescription('Click the button to submit your Minecraft username for whitelisting.')
            .setColor(0x00FF00);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('whitelist_button')
                    .setLabel('Submit Username')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        interaction.reply({ content: 'Whitelist submission message sent!', ephemeral: true });
    },
};