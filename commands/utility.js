const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder().setName('help').setDescription('📜 View all available commands'),
        async execute(i) {
            const embed = new EmbedBuilder()
                .setColor('#00FFCC').setTitle('⚡ ServerForge Command Menu')
                .setDescription('Explore the power of 151+ commands.')
                .addFields(
                    { name: '🛠️ Utility', value: '`/ping`, `/uptime`, `/invite`, `/help`', inline: true },
                    { name: '👤 Info', value: '`/userinfo`, `/serverinfo`, `/botinfo`, `/avatar`', inline: true },
                    { name: '🧹 Admin', value: '`/clear` (More coming soon)', inline: true },
                    { name: '💡 Feedback', value: '`/suggest` (Send ideas to dev!)', inline: true }
                ).setFooter({ text: 'ServerForge | Performance & Security' });
            await i.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('ping').setDescription('📶 Check bot latency'),
        async execute(i) {
            const sent = await i.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
            const embed = new EmbedBuilder()
                .setColor('#00FFCC').setTitle('📶 Pong!')
                .addFields(
                    { name: 'Bot Latency', value: `${sent.createdTimestamp - i.createdTimestamp}ms`, inline: true },
                    { name: 'API Latency', value: `${Math.round(i.client.ws.ping)}ms`, inline: true }
                );
            await i.editReply({ content: null, embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('userinfo').setDescription('👤 Get info about a user').addUserOption(o => o.setName('target').setDescription('The user')),
        async execute(i) {
            const member = i.options.getMember('target') || i.member;
            const embed = new EmbedBuilder()
                .setColor('#BF00FF').setTitle(`👤 ${member.user.username}`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Roles', value: member.roles.cache.map(r => r).join(' ').replace('@everyone', '') || 'None' }
                );
            await i.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('serverinfo').setDescription('🏰 View server details'),
        async execute(i) {
            const embed = new EmbedBuilder()
                .setColor('#0077FF').setTitle(`🏰 ${i.guild.name}`)
                .setThumbnail(i.guild.iconURL())
                .addFields(
                    { name: 'Members', value: `${i.guild.memberCount}`, inline: true },
                    { name: 'Boosts', value: `${i.guild.premiumSubscriptionCount || 0}`, inline: true }
                );
            await i.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('botinfo').setDescription('🤖 Technical stats about ServerForge'),
        async execute(i) {
            const embed = new EmbedBuilder()
                .setColor('#BF00FF').setTitle('🤖 ServerForge Stats')
                .addFields(
                    { name: 'Latency', value: `${i.client.ws.ping}ms`, inline: true },
                    { name: 'Servers', value: `${i.client.guilds.cache.size}`, inline: true },
                    { name: 'Uptime', value: `${Math.round(i.client.uptime / 60000)}m`, inline: true }
                );
            await i.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('avatar').setDescription('🖼️ Get user avatar').addUserOption(o => o.setName('target').setDescription('The user')),
        async execute(i) {
            const user = i.options.getUser('target') || i.user;
            const embed = new EmbedBuilder().setColor('#00FFCC').setTitle(`${user.username}'s Avatar`).setImage(user.displayAvatarURL({ size: 1024, dynamic: true }));
            await i.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('invite').setDescription('🔗 Get the bot invite link'),
        async execute(i) {
            await i.reply({ 
                content: `🔗 **Add me to your server:** https://discord.com/oauth2/authorize?client_id=1489497753523327047&permissions=8&integration_type=0&scope=applications.commands+bot`, 
                ephemeral: true 
            });
        }
    },
    {
        data: new SlashCommandBuilder().setName('clear').setDescription('🧹 Delete messages').addIntegerOption(o => o.setName('amount').setDescription('1-100').setRequired(true)),
        async execute(i) {
            if (!i.member.permissions.has(PermissionFlagsBits.ManageMessages)) return i.reply({ content: '❌ No permission.', ephemeral: true });
            const amount = i.options.getInteger('amount');
            await i.channel.bulkDelete(Math.min(amount, 100));
            await i.reply({ content: `🧹 Deleted ${amount} messages.`, ephemeral: true });
        }
    }
];
