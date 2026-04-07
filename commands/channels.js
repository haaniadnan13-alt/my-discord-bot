const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('hide')
            .setDescription('👻 Hide the current channel from everyone'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: false });
            await interaction.reply('👻 Channel is now **hidden**.');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('show')
            .setDescription('👁️ Make the channel visible to everyone'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { ViewChannel: true });
            await interaction.reply('👁️ Channel is now **visible**.');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('nuke')
            .setDescription('☢️ Delete and recreate the channel'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const position = interaction.channel.position;
            const newChannel = await interaction.channel.clone();
            await interaction.channel.delete();
            await newChannel.setPosition(position);
            await newChannel.send('☢️ **Channel Nuked Successfully.**');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('slowmode')
            .setDescription('⏳ Set channel slowmode')
            .addIntegerOption(o => o.setName('seconds').setDescription('0-21600').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const sec = interaction.options.getInteger('seconds');
            await interaction.channel.setRateLimitPerUser(sec);
            await interaction.reply(`⏳ Slowmode set to **${sec}** seconds.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('deletechannel')
            .setDescription('🗑️ Delete the current channel'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            await interaction.reply('🗑️ Deleting channel in 3 seconds...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('deleteall')
            .setDescription('☢️ DELETE EVERY CHANNEL IN THE SERVER'),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            await interaction.reply('⚠️ **DELETING ALL CHANNELS...**');
            const channels = await interaction.guild.channels.cache;
            channels.forEach(ch => {
                if (ch.id !== interaction.channel.id) ch.delete().catch(() => {});
            });
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
    }
];
