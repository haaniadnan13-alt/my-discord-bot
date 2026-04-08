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
                    { name: 'Bot Latency', value: `${sent.createdTimestamp - i.createdTimestamp}ms`, inline: true }
                );
            await i.editReply({ content: null, embeds: [embed] });
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
            await i.channel.bulkDelete(Math.min(amount, 100), true);
            await i.reply({ content: `🧹 Cleared **${amount}** messages.`, ephemeral: true });
        }
    }
];
