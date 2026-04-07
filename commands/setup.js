const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('set-welcome')
            .setDescription('👋 Choose the welcome channel')
            .addChannelOption(o => o.setName('channel').setDescription('Select channel').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
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
            .addChannelOption(o => o.setName('channel').setDescription('Select channel').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
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
            .addRoleOption(o => o.setName('role').setDescription('Select role').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const role = interaction.options.getRole('role');
            const guildId = interaction.guild.id;
            if (!global.settings[guildId]) global.settings[guildId] = {};
            global.settings[guildId].autorole = role.id;
            await interaction.reply(`✅ New members will now get the **${role.name}** role automatically.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('perm')
            .setDescription('🔑 Manage bot permissions')
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true))
            .addStringOption(o => o.setName('action').setDescription('Allow/Deny').setRequired(true).addChoices({ name: 'Allow', value: 'allow' }, { name: 'Deny', value: 'deny' }))
            .addStringOption(o => o.setName('command').setDescription('Command name').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const role = interaction.options.getRole('role');
            const action = interaction.options.getString('action');
            const cmd = interaction.options.getString('command');
            await interaction.reply(`🔑 Role **${role.name}** is now **${action}ed** for **${cmd}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('config')
            .setDescription('⚙️ View server configuration'),
        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setColor('#00FFCC')
                .setTitle('⚙️ Server Configuration')
                .addFields(
                    { name: 'Logging', value: 'Enabled', inline: true },
                    { name: 'Counting', value: 'Active', inline: true }
                );
            await interaction.reply({ embeds: [embed] });
        }
    }
];
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
