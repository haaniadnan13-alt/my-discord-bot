const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('setup-verify')
            .setDescription('Set the verification channel and the role to be given')
            .addChannelOption(o => o.setName('channel').setDescription('Select the channel for the verify message').addChannelTypes(ChannelType.GuildText).setRequired(true))
            .addRoleOption(o => o.setName('role').setDescription('Select the role to give upon verification').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator permissions to use this command.', ephemeral: true });
            }
            
            const channel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role');

            const embed = new EmbedBuilder()
                .setTitle('Server Verification')
                .setDescription('To gain access to the rest of the server, please click the button below to verify yourself.')
                .setColor('#2f3136')
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_button')
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Success)
            );

            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `✅ Verification system has been set up in ${channel} with the role ${role}.`, ephemeral: true });
        }
    }
];
