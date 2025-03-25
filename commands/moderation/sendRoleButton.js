const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { roleMappings, devs } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sendroles')
        .setDescription('Send a reaction role message'),
    async execute(interaction) {
        if (!interaction.guild) return;
        if (!devs.includes(interaction.user.id)) return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        const embed = new EmbedBuilder()
            .setTitle('Get Notified!')
            .setDescription('Click the button to add/remove the notification role.')
            .setColor(0x00FF00);

        const row = new ActionRowBuilder();

        Object.keys(roleMappings).forEach(buttonID => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(buttonID)
                    .setLabel(`${buttonID}`)
                    .setStyle(ButtonStyle.Primary)
            );
        });
        const message = await interaction.channel.send({ embeds: [embed], components: [row] });

        interaction.reply({ content: 'Role selection message sent!', ephemeral: true });
    },
};
