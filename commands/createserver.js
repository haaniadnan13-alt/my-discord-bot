const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createserver')
        .setDescription('🛠️ Build a professional server from templates')
        .addStringOption(o => o.setName('game').setDescription('Select template').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const game = interaction.options.getString('game').toLowerCase();
        const ownerID = '1316341477114122305';
        const guild = interaction.guild;

        if (game === 'support' && interaction.user.id !== ownerID) {
            return interaction.reply({ content: '❌ Error: Template not found.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            const template = require(path.join(__dirname, '..', 'templates', `${game}.js`));
            const rMap = {};
            for (const r of template.roles) {
                rMap[r.n] = await guild.roles.create({ name: r.n, color: r.c, permissions: r.p });
            }

            const verifiedRole = rMap['✅ Verified'] || rMap['Member'];
            const staffRole = rMap['🔧 Moderator'] || rMap['Staff'] || rMap['Moderator'];

            for (const cat of template.categories) {
                let overwrites = [{ id: guild.id, deny: [PermissionFlagsBits.ViewChannel] }];

                if (cat.isVerify) {
                    overwrites = [
                        { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
                        { id: verifiedRole.id, deny: [PermissionFlagsBits.ViewChannel] }
                    ];
                } else if (cat.staffOnly) {
                    overwrites.push({ id: staffRole.id, allow: [PermissionFlagsBits.ViewChannel] });
                } else {
                    overwrites.push({ id: verifiedRole.id, allow: [PermissionFlagsBits.ViewChannel] });
                }

                const category = await guild.channels.create({
                    name: cat.name,
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: overwrites
                });

                for (const ch of cat.channels) {
                    const type = cat.isVoice ? ChannelType.GuildVoice : ChannelType.GuildText;
                    const channel = await guild.channels.create({ name: ch.n, type: type, parent: category.id });

                    if (cat.isPublic) {
                        await channel.permissionOverwrites.edit(verifiedRole.id, { SendMessages: false });
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(ch.n.toUpperCase())
                        .setDescription(ch.d || 'No description.')
                        .setColor(verifiedRole.color);

                    // --- AUTOMATION: ONLY FOR SUPPORT TEMPLATE ---
                    if (game === 'support') {
                        if (cat.isVerify) {
                            const row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder().setCustomId('verify_button').setLabel('Verify').setStyle(ButtonStyle.Success)
                            );
                            await channel.send({ embeds: [embed], components: [row] });
                        } 
                        else if (ch.autoRules && template.rulesList) {
                            const rulesEmbed = new EmbedBuilder()
                                .setTitle('📜 SERVER RULES')
                                .setDescription(template.rulesList.join('\n\n'))
                                .setColor('#8B0000');
                            await channel.send({ embeds: [embed] });
                            await channel.send({ embeds: [rulesEmbed] });
                        } 
                        else if (ch.isTicket) {
                            const tRow = new ActionRowBuilder().addComponents(
                                new ButtonBuilder().setCustomId('open_ticket').setLabel('Open Ticket').setStyle(ButtonStyle.Primary).setEmoji('🎫')
                            );
                            await channel.send({ embeds: [embed], components: [tRow] });
                        }
                        else {
                            await channel.send({ embeds: [embed] });
                        }
                    } else {
                        // Regular gaming template behavior
                        await channel.send({ embeds: [embed] });
                    }
                }
            }
            return interaction.editReply(`✅ **${game.toUpperCase()} SERVER DEPLOYED.**`);
        } catch (e) {
            console.error(e);
            return interaction.editReply('❌ Error loading template.');
        }
    }
};
