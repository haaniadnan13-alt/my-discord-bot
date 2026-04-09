const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

// This variable stores the state so index.js can see if it should be watching joins
global.raidDetection = false;

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
            
            // Engine: Changes server-wide security entry requirements
            if (status === 'on') {
                await interaction.guild.setVerificationLevel(4); 
            } else {
                await interaction.guild.setVerificationLevel(2);
            }

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🚨 SECURITY ALERT')
                .setDescription(`Raidmode is **${status.toUpperCase()}**. Server verification is now set to ${status === 'on' ? 'Highest (Phone Required)' : 'Medium'}.`);
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
            
            await interaction.deferReply();
            const status = interaction.options.getString('status');
            const channels = interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText);

            // Engine: Loops and physically locks/unlocks the @everyone role
            for (const [id, channel] of channels) {
                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                    SendMessages: status === 'on' ? false : null
                }).catch(() => null);
            }

            await interaction.editReply({ content: `🔒 Lockdown is **${status.toUpperCase()}**. All text channels have been updated.` });
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
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            
            const status = interaction.options.getString('status');
            global.raidDetection = (status === 'on');
            
            await interaction.reply(`🔍 Raid detection is now **${status.toUpperCase()}**. The bot will now monitor join speed.`);
        }
    }
];
