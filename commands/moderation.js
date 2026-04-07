const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('lock')
            .setDescription('🔒 Lock the current channel')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
        async execute(interaction) {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
            await interaction.reply('🔒 This channel has been locked.');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('unlock')
            .setDescription('🔓 Unlock the current channel')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
        async execute(interaction) {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });
            await interaction.reply('🔓 This channel is now unlocked.');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('lockall')
            .setDescription('🚨 LOCK THE ENTIRE SERVER')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(interaction) {
            await interaction.deferReply();
            const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
            for (const [id, channel] of channels) {
                await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false }).catch(() => null);
            }
            await interaction.editReply('🚨 All text channels have been locked.');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('unlockall')
            .setDescription('🔓 UNLOCK THE ENTIRE SERVER')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(interaction) {
            await interaction.deferReply();
            const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);
            for (const [id, channel] of channels) {
                await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).catch(() => null);
            }
            await interaction.editReply('🔓 All text channels have been unlocked.');
        }
    }
];
