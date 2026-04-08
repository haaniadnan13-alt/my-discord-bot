const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ChannelType 
} = require('discord.js');

module.exports = [
    {
        // --- 1. SETUP COMMAND (Global) ---
        data: new SlashCommandBuilder()
            .setName('ticket-setup')
            .setDescription('Deploy the ticket rules and button to a specific channel')
            .addChannelOption(option => 
                option.setName('channel')
                .setDescription('The channel to send the ticket system to')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction) {
            const targetChannel = interaction.options.getChannel('channel');

            const rulesEmbed = new EmbedBuilder()
                .setTitle('🎫 CREATE-TICKET')
                .setColor('#00ffcc') // Neon Cyan
                .setDescription(
                    '**TICKET RULE MESSAGE**\n' +
                    '• Do not open tickets for jokes or random reasons\n' +
                    '• Only open for real support, bugs, or account issues\n' +
                    '• One ticket per problem\n' +
                    '• Be respectful to staff\n' +
                    '• Provide details and screenshots\n' +
                    '• Spam tickets may result in timeout'
                )
                .setFooter({ text: 'You must read the rules before opening a ticket.' });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket_btn')
                    .setLabel('CREATE TICKET')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary)
            );

            const msg = await targetChannel.send({ embeds: [rulesEmbed], components: [row] });
            await msg.pin().catch(() => null); // Auto-pin requirement

            await interaction.reply({ content: `✅ Ticket system deployed and pinned in ${targetChannel}!`, ephemeral: true });
        }
    },
    {
        // --- 2. CLOSE COMMAND (Staff Only) ---
        data: new SlashCommandBuilder()
            .setName('close')
            .setDescription('Staff Only: Deletes the current ticket channel.')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
        async execute(interaction) {
            // Check if name matches our ticket format
            if (!interaction.channel.name.startsWith('🎫-')) {
                return interaction.reply({ content: "❌ This command can only be used inside a ticket channel.", ephemeral: true });
            }

            await interaction.reply('🔒 **Closing ticket... Channel will be deleted in 5 seconds.**');
            setTimeout(() => interaction.channel.delete().catch(() => null), 5000);
        }
    },
    {
        // --- 3. TICKET BEHAVIOR (Internal Logic) ---
        name: 'interactionCreate',
        async execute(interaction) {
            if (!interaction.isButton() || interaction.customId !== 'create_ticket_btn') return;

            const { guild, user } = interaction;

            try {
                // Creates channel at the absolute TOP of the server
                const ticketChannel = await guild.channels.create({
                    name: `🎫-${user.username}`,
                    type: ChannelType.GuildText,
                    position: 0, // Top of the list
                    permissionOverwrites: [
                        {
                            id: guild.id, // @everyone 
                            deny: [PermissionFlagsBits.ViewChannel], // NO ONE CAN SEE
                        },
                        {
                            id: user.id, // Ticket Creator
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory,
                                PermissionFlagsBits.AttachFiles,
                                PermissionFlagsBits.EmbedLinks
                            ],
                        },
                        {
                            id: interaction.client.user.id, // The Bot
                            allow: [
                                PermissionFlagsBits.ManageChannels,
                                PermissionFlagsBits.ManageRoles,
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages
                            ]
                        }
                        // Staff with Administrator automatically bypass the @everyone lock
                    ],
                });

                const welcomeEmbed = new EmbedBuilder()
                    .setColor('#bc13fe') // Neon Purple
                    .setDescription(`Hello, your support ticket has been created. Please explain your issue in detail. A staff member will assist you shortly.`)
                    .setTimestamp();

                await ticketChannel.send({ embeds: [welcomeEmbed] });
                await interaction.reply({ content: `Ticket created! Check ${ticketChannel}`, ephemeral: true });

            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "❌ Error creating ticket. Check bot permissions!", ephemeral: true });
            }
        }
    }
];
