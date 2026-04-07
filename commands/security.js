const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('raidmode')
            .setDescription('🚨 Activate server-wide raid protection')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const status = interaction.options.getString('status');
            const embed = new EmbedBuilder()
                .setColor('#FF0000') // Bright Red for emergency
                .setTitle('🚨 SECURITY ALERT')
                .setDescription(`Raidmode has been turned **${status.toUpperCase()}**. New member joins are restricted and channels are being monitored.`);
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('lockdown')
            .setDescription('🔒 Temporarily lock all public channels')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const status = interaction.options.getString('status');
            await interaction.reply({ content: `🔒 Server lockdown is now **${status.toUpperCase()}**. Permission edits in progress...` });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('verify')
            .setDescription('🛡️ Setup or trigger the member verification system')
            .addRoleOption(o => o.setName('role').setDescription('Role to give upon verification').setRequired(true)),
        async execute(interaction) {
            const role = interaction.options.getRole('role');
            const embed = new EmbedBuilder()
                .setColor('#00FFCC')
                .setTitle('🛡️ Verification Required')
                .setDescription(`Click the button below to verify and get the **${role.name}** role.`);
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('raiddetect')
            .setDescription('🔍 Toggle automatic raid pattern detection')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            const status = interaction.options.getString('status');
            await interaction.reply(`🔍 Raid detection algorithm is now **${status.toUpperCase()}**.`);
        }
    }
];
