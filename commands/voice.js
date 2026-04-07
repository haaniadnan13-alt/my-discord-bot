const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('vkick')
            .setDescription('🔇 Kick a member from a voice channel')
            .addUserOption(o => o.setName('target').setDescription('The user').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.MoveMembers)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const member = interaction.options.getMember('target');
            if (!member.voice.channel) return interaction.reply('❌ User is not in a voice channel.');
            await member.voice.disconnect();
            await interaction.reply(`🔇 **${member.user.username}** has been disconnected from voice.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('vmute')
            .setDescription('🎙️ Server-mute a member in voice')
            .addUserOption(o => o.setName('target').setDescription('The user').setRequired(true))
            .addStringOption(o => o.setName('status').setDescription('On/Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const member = interaction.options.getMember('target');
            const status = interaction.options.getString('status') === 'on';
            await member.voice.setMute(status);
            await interaction.reply(`🎙️ **${member.user.username}** mute status: **${status ? 'ON' : 'OFF'}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('vdeafen')
            .setDescription('🎧 Server-deafen a member')
            .addUserOption(o => o.setName('target').setDescription('The user').setRequired(true))
            .addStringOption(o => o.setName('status').setDescription('On/Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.DeafenMembers)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const member = interaction.options.getMember('target');
            const status = interaction.options.getString('status') === 'on';
            await member.voice.setDeaf(status);
            await interaction.reply(`🎧 **${member.user.username}** deafen status: **${status ? 'ON' : 'OFF'}**.`);
        }
    }
];
