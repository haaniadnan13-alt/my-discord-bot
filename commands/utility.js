const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder().setName('ping').setDescription('📶 Check bot and API latency'),
        async execute(interaction) {
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
            const embed = new EmbedBuilder()
                .setColor('#00FFCC').setTitle('📶 Pong!')
                .addFields(
                    { name: 'Bot Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                    { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
                );
            await interaction.editReply({ content: null, embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('userinfo').setDescription('👤 Get info about a user').addUserOption(o => o.setName('target').setDescription('The user')),
        async execute(interaction) {
            const member = interaction.options.getMember('target') || interaction.member;
            const embed = new EmbedBuilder()
                .setColor('#BF00FF').setTitle(`👤 ${member.user.username} Info`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Roles', value: member.roles.cache.map(r => r).join(' ').replace('@everyone', '') || 'None' }
                );
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('serverinfo').setDescription('🏰 View server details'),
        async execute(interaction) {
            const { guild } = interaction;
            const embed = new EmbedBuilder()
                .setColor('#0077FF').setTitle(`🏰 ${guild.name}`)
                .setThumbnail(guild.iconURL())
                .addFields(
                    { name: 'Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true }
                );
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('avatar').setDescription('🖼️ Get user avatar').addUserOption(o => o.setName('target').setDescription('The user')),
        async execute(interaction) {
            const user = interaction.options.getUser('target') || interaction.user;
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setTitle(`${user.username}'s Avatar`).setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('clear').setDescription('🧹 Delete multiple messages').addIntegerOption(o => o.setName('amount').setDescription('Number of messages (1-100)').setRequired(true).setMinValue(1).setMaxValue(100)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: '❌ No permission!', ephemeral: true });
            const amount = interaction.options.getInteger('amount');
            await interaction.channel.bulkDelete(amount);
            await interaction.reply({ content: `🧹 Deleted ${amount} messages.`, ephemeral: true });
        }
    }
];
