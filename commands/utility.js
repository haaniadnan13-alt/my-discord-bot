const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('🏓 Check bot and API latency'),
        async execute(interaction) {
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
            const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
            await interaction.editReply(`🏓 **Pong!**\n- API Latency: \`${interaction.client.ws.ping}ms\`\n- Bot Latency: \`${roundtrip}ms\``);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('uptime')
            .setDescription('⏰ See how long the bot has been online'),
        async execute(interaction) {
            let totalSeconds = (interaction.client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600) % 24;
            let minutes = Math.floor(totalSeconds / 60) % 60;
            let seconds = Math.floor(totalSeconds % 60);

            await interaction.reply({ content: `⏰ **Uptime:** \`${days}d ${hours}h ${minutes}m ${seconds}s\`` });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('📊 Show detailed server stats'),
        async execute(interaction) {
            const { guild } = interaction;
            const embed = new EmbedBuilder()
                .setTitle(`${guild.name}`)
                .setThumbnail(guild.iconURL())
                .addFields(
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
                )
                .setColor('#00FF00');
            await interaction.reply({ embeds: [embed] });
        }
    }
];
