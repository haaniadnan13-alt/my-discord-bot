const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder().setName('ban').setDescription('🔨 Ban a member').addUserOption(o => o.setName('target').setDescription('The user').setRequired(true)).addStringOption(o => o.setName('reason').setDescription('Reason')),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const user = interaction.options.getMember('target');
            if (!user.bannable) return interaction.reply('❌ Cannot ban this user.');
            await user.ban({ reason: interaction.options.getString('reason') || 'No reason' });
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#BF00FF').setDescription(`🔨 **${user.user.tag}** banned.`)] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('kick').setDescription('👢 Kick a member').addUserOption(o => o.setName('target').setDescription('The user').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const user = interaction.options.getMember('target');
            if (!user.kickable) return interaction.reply('❌ Cannot kick this user.');
            await user.kick();
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#BF00FF').setDescription(`👢 **${user.user.tag}** kicked.`)] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('clear').setDescription('🧹 Delete messages').addIntegerOption(o => o.setName('amount').setDescription('1-100').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const amount = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(amount, true);
            await interaction.reply({ content: `🧹 Deleted **${amount}** messages.`, ephemeral: true });
        }
    },
    {
        data: new SlashCommandBuilder().setName('slowmode').setDescription('⏳ Set channel slowmode').addIntegerOption(o => o.setName('seconds').setDescription('Seconds').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            await interaction.channel.setRateLimitPerUser(interaction.options.getInteger('seconds'));
            await interaction.reply(`⏳ Slowmode set to **${interaction.options.getInteger('seconds')}**s.`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('lock').setDescription('🔒 Lock the channel'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
            await interaction.reply('🔒 Channel locked.');
        }
    },
    {
        data: new SlashCommandBuilder().setName('unlock').setDescription('🔓 Unlock the channel'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true });
            await interaction.reply('🔓 Channel unlocked.');
        }
    },
    {
        data: new SlashCommandBuilder().setName('nickname').setDescription('🏷️ Change a users nickname').addUserOption(o => o.setName('target').setDescription('The user').setRequired(true)).addStringOption(o => o.setName('name').setDescription('New nickname').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const member = interaction.options.getMember('target');
            await member.setNickname(interaction.options.getString('name'));
            await interaction.reply(`✅ Nickname changed for **${member.user.username}**.`);
        }
    }
];
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
