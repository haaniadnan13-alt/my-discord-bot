    {
        data: new SlashCommandBuilder().setName('help').setDescription('📜 View all available commands'),
        async execute(i) {
            const embed = new EmbedBuilder()
                .setColor('#00FFCC')
                .setTitle('⚡ ServerForge Command Menu')
                .setDescription('Use the categories below to explore my 151+ commands.')
                .addFields(
                    { name: '🛠️ Utility', value: '`/ping`, `/uptime`, `/invite`, `/help`', inline: true },
                    { name: '👤 Information', value: '`/userinfo`, `/serverinfo`, `/avatar`, `/botinfo`', inline: true },
                    { name: '🧹 Moderation', value: '`/clear`, `/kick`, `/ban`', inline: true },
                    { name: '💡 Feedback', value: '`/suggest` (Send ideas to dev!)', inline: true }
                )
                .setFooter({ text: 'More commands coming every week!' });
            await i.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('botinfo').setDescription('🤖 Technical stats about ServerForge'),
        async execute(i) {
            const embed = new EmbedBuilder()
                .setColor('#BF00FF')
                .setTitle('🤖 ServerForge Statistics')
                .addFields(
                    { name: 'Latency', value: `${i.client.ws.ping}ms`, inline: true },
                    { name: 'Servers', value: `${i.client.guilds.cache.size}`, inline: true },
                    { name: 'Version', value: 'v2.0.4 (Stable)', inline: true },
                    { name: 'Platform', value: 'Node.js v20', inline: true }
                );
            await i.reply({ embeds: [embed] });
        }
    }
