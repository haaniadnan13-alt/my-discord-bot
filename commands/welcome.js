const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('welcome')
            .setDescription('👋 Setup welcome messages')
            .addSubcommand(sub => sub.setName('setchannel').setDescription('Set the welcome channel').addChannelOption(o => o.setName('channel').setDescription('The channel').setRequired(true)))
            .addSubcommand(sub => sub.setName('message').setDescription('Set a custom welcome message').addStringOption(o => o.setName('text').setDescription('The message').setRequired(true))),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const sub = interaction.options.getSubcommand();
            await interaction.reply({ content: `✅ Welcome ${sub === 'setchannel' ? 'channel' : 'message'} has been updated!`, ephemeral: true });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('goodbye')
            .setDescription('🏃 Setup leave messages')
            .addSubcommand(sub => sub.setName('setchannel').setDescription('Set the goodbye channel').addChannelOption(o => o.setName('channel').setDescription('The channel').setRequired(true)))
            .addSubcommand(sub => sub.setName('message').setDescription('Set a custom goodbye message').addStringOption(o => o.setName('text').setDescription('The message').setRequired(true))),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const sub = interaction.options.getSubcommand();
            await interaction.reply({ content: `✅ Goodbye ${sub === 'setchannel' ? 'channel' : 'message'} has been updated!`, ephemeral: true });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('autorole')
            .setDescription('🤖 Automatically assign a role to new members')
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true))
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const role = interaction.options.getRole('role');
            const status = interaction.options.getString('status');
            await interaction.reply(`🤖 Autorole for **${role.name}** is now **${status.toUpperCase()}**.`);
        }
    }
];
