const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [{
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('💡 Send a suggestion to my developer')
        .addStringOption(o => o.setName('idea').setDescription('What is your idea?').setRequired(true)),
    async execute(i) {
        const idea = i.options.getString('idea');
        const devId = '1316341477114122305'; 

        const embed = new EmbedBuilder()
            .setColor('#00FFCC')
            .setTitle('📥 New Suggestion')
            .setAuthor({ name: i.user.tag, iconURL: i.user.displayAvatarURL() })
            .setDescription(idea)
            .setFooter({ text: `User ID: ${i.user.id}` })
            .setTimestamp();

        try {
            const dev = await i.client.users.fetch(devId);
            await dev.send({ embeds: [embed] });
            await i.reply({ content: '✅ Suggestion sent to developer!', ephemeral: true });
        } catch (e) {
            await i.reply({ content: '❌ Developer DMs are closed!', ephemeral: true });
        }
    }
}];
