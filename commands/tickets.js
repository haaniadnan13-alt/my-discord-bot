const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('ticket')
            .setDescription('🎫 Ticket system management')
            .addSubcommand(sub => sub.setName('create').setDescription('Open a support ticket').addStringOption(o => o.setName('reason').setDescription('Why are you opening a ticket?')))
            .addSubcommand(sub => sub.setName('close').setDescription('Close the current ticket'))
            .addSubcommand(sub => sub.setName('add').setDescription('Add a user to the ticket').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)))
            .addSubcommand(sub => sub.setName('remove').setDescription('Remove a user from the ticket').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)))
            .addSubcommand(sub => sub.setName('rename').setDescription('Rename the ticket channel').addStringOption(o => o.setName('name').setDescription('New name').setRequired(true))),
        async execute(interaction) {
            const sub = interaction.options.getSubcommand();
            
            if (sub === 'create') {
                const reason = interaction.options.getString('reason') || 'No reason provided';
                await interaction.reply({ content: `🎫 Ticket creating for: **${reason}**...`, ephemeral: true });
                // Note: Logic for creating the actual channel goes in your events or a helper function later!
            } else {
                // Admin/Mod check for other subcommands
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ Staff only!', ephemeral: true });
                await interaction.reply(`✅ Ticket action **${sub}** performed.`);
            }
        }
    }
];
