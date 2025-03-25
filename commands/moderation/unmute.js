const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { green } = require('../../colors.json');
const { roles } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user from the server.')
        .setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription('The user to unmute').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles) && !interaction.member.roles.cache.has(roles.modRole)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user);
        member.timeout(null, 'Unmuted')
        const embed = new EmbedBuilder()
        .setTitle('User Unmute')
        .setDescription(`**${member.user.tag}** has been unmuted.`)
        .setColor(green)
        .setTimestamp();
        await interaction.reply({ embeds: [embed] });

        const dmEmbed = new EmbedBuilder()
        .setTitle('User Unmute')
        .setDescription(`You have been unmuted in **${interaction.guild.name}**.`)
        .setColor(green)
        .setTimestamp();
        await member.send({ embeds: [dmEmbed] });
    },
};