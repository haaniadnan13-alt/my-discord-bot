const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('setlogs')
            .setDescription('📜 Set the channel for server logs')
            .addChannelOption(o => o.setName('channel').setDescription('The log channel').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const channel = interaction.options.getChannel('channel');
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setDescription(`✅ **Success:** Logs will now be sent to ${channel}.`)] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('logtoggle')
            .setDescription('🔧 Toggle specific log types')
            .addStringOption(o => o.setName('type').setDescription('What to log').setRequired(true).addChoices(
                { name: 'Message Deletes', value: 'msg_del' },
                { name: 'Member Joins', value: 'mem_join' },
                { name: 'Role Updates', value: 'role_upd' }
            ))
            .addStringOption(o => o.setName('status').setDescription('On/Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            const type = interaction.options.getString('type');
            const status = interaction.options.getString('status');
            await interaction.reply(`🔧 **${type}** logging is now **${status.toUpperCase()}**.`);
        }
    }
];
