const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('kick')
            .setDescription('👢 Kick a member')
            .addUserOption(o => o.setName('target').setDescription('The member to kick').setRequired(true))
            .addStringOption(o => o.setName('reason').setDescription('Reason')),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
            const user = interaction.options.getMember('target');
            if (!user?.kickable) return interaction.reply('❌ I cannot kick this user.');
            await user.kick(interaction.options.getString('reason') || 'No reason');
            await interaction.reply(`✅ **${user.user.tag}** was kicked.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('ban')
            .setDescription('🔨 Ban a member')
            .addUserOption(o => o.setName('target').setDescription('The member to ban').setRequired(true))
            .addStringOption(o => o.setName('reason').setDescription('Reason')),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
            const user = interaction.options.getMember('target');
            if (!user?.bannable) return interaction.reply('❌ I cannot ban this user.');
            await user.ban({ reason: interaction.options.getString('reason') || 'No reason' });
            await interaction.reply(`✅ **${user.user.tag}** was banned.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('slowmode')
            .setDescription('⏳ Set channel slowmode')
            .addIntegerOption(o => o.setName('seconds').setDescription('Seconds (0 to disable)').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
            const sec = interaction.options.getInteger('seconds');
            await interaction.channel.setRateLimitPerUser(sec);
            await interaction.reply(`⏳ Slowmode set to **${sec}** seconds.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('timeout')
            .setDescription('🔇 Timeout a member')
            .addUserOption(o => o.setName('target').setDescription('The member').setRequired(true))
            .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
            const user = interaction.options.getMember('target');
            const min = interaction.options.getInteger('minutes');
            if (!user?.manageable) return interaction.reply('❌ I cannot mute this user.');
            await user.timeout(min * 60000);
            await interaction.reply(`🔇 **${user.user.tag}** muted for ${min} minutes.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('clear')
            .setDescription('🧹 Bulk delete messages')
            .addIntegerOption(o => o.setName('amount').setDescription('1-100').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
            const amount = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(Math.min(amount, 100), true);
            await interaction.reply({ content: `🧹 Cleared **${amount}** messages.`, ephemeral: true });
        }
    }
];
