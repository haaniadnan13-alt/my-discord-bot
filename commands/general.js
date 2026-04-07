const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('say')
            .setDescription('🗣️ Make the bot say something')
            .addStringOption(o => o.setName('message').setDescription('The message to send').setRequired(true)),
        async execute(interaction) {
            const message = interaction.options.getString('message');
            await interaction.reply({ content: '✅ Message sent!', ephemeral: true });
            return interaction.channel.send(message);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('poll')
            .setDescription('🗳️ Create a simple Yes/No poll')
            .addStringOption(o => o.setName('question').setDescription('What are we voting on?').setRequired(true)),
        async execute(interaction) {
            const question = interaction.options.getString('question');
            const embed = new EmbedBuilder()
                .setTitle('📊 Poll')
                .setDescription(question)
                .setColor('#5865F2')
                .setFooter({ text: `Started by ${interaction.user.username}` })
                .setTimestamp();

            const pollMsg = await interaction.reply({ embeds: [embed], fetchReply: true });
            await pollMsg.react('👍');
            await pollMsg.react('👎');
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('embed')
            .setDescription('🖼️ Send a custom styled embed')
            .addStringOption(o => o.setName('title').setDescription('Embed title').setRequired(true))
            .addStringOption(o => o.setName('description').setDescription('Embed content').setRequired(true))
            .addStringOption(o => o.setName('color').setDescription('Hex color (e.g. #FF0000)')),
        async execute(interaction) {
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const color = interaction.options.getString('color') || '#00FF00';

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color.startsWith('#') ? color : '#00FF00');

            return interaction.reply({ embeds: [embed] });
        }
    }
];
