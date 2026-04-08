const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Deploy the CREATE-TICKET channel with rules and button')
        .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Select the channel for the ticket system')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const targetChannel = interaction.options.getChannel('channel');

        const rulesEmbed = new EmbedBuilder()
            .setTitle('🎫 CREATE-TICKET')
            .setColor('#00ffcc')
            .setDescription(
                '• Do not open tickets for jokes or random reasons\n' +
                '• Only open for real support, bugs, or account issues\n' +
                '• One ticket per problem\n' +
                '• Be respectful to staff\n' +
                '• Provide details and screenshots\n' +
                '• Spam tickets may result in timeout'
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket_btn')
                .setLabel('CREATE TICKET')
                .setEmoji('🎫')
                .setStyle(ButtonStyle.Primary)
        );

        const msg = await targetChannel.send({ embeds: [rulesEmbed], components: [row] });
        await msg.pin().catch(() => null);

        await interaction.reply({ content: `✅ System deployed in ${targetChannel}`, ephemeral: true });
    }
};
