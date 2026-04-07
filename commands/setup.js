const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('set-welcome')
            .setDescription('👋 Choose the welcome channel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addChannelOption(o => o.setName('channel').setDescription('Select channel').setRequired(true)),
        async execute(interaction) {
            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guild.id;
            
            if (!global.settings[guildId]) global.settings[guildId] = {};
            global.settings[guildId].welcomeChannel = channel.id;
            
            await interaction.reply(`✅ Welcome messages will now be sent in ${channel}!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('set-counting')
            .setDescription('🔢 Choose the counting channel')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addChannelOption(o => o.setName('channel').setDescription('Select channel').setRequired(true)),
        async execute(interaction) {
            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guild.id;

            if (!global.settings[guildId]) global.settings[guildId] = {};
            global.settings[guildId].countingChannel = channel.id;
            global.settings[guildId].count = 0; 
            
            await interaction.reply(`✅ Counting system enabled in ${channel}! Start at **1**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('set-autorole')
            .setDescription('👥 Choose the role given to new members')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
            .addRoleOption(o => o.setName('role').setDescription('Select role').setRequired(true)),
        async execute(interaction) {
            const role = interaction.options.getRole('role');
            const guildId = interaction.guild.id;

            if (!global.settings[guildId]) global.settings[guildId] = {};
            global.settings[guildId].autorole = role.id;
            
            await interaction.reply(`✅ New members will now get the **${role.name}** role automatically.`);
        }
    }
];
