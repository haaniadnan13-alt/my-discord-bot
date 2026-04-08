const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const templates = require('../server_new.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createserver')
        .setDescription('🛠️ Build a professional gaming server with precise permissions')
        .addStringOption(o => o.setName('game').setDescription('Select template (rl, mc, cod, apex, roblox, rivals)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const game = interaction.options.getString('game').toLowerCase();
        const guild = interaction.guild;

        await interaction.deferReply();

        try {
            // 1. Setup Roles
            const verifiedRole = await guild.roles.create({ name: 'Member', color: '#3498db', reason: 'Server Setup' });
            const staffRole = await guild.roles.create({ name: 'Staff', color: '#e74c3c', permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers], reason: 'Server Setup' });

            // 2. VERIFICATION CATEGORY (Private to unverified)
            const verifyCat = await guild.channels.create({ name: '🛡️┃VERIFICATION', type: ChannelType.GuildCategory });
            const verifyChan = await guild.channels.create({
                name: '✅┃verify-here',
                type: ChannelType.GuildText,
                parent: verifyCat.id,
                permissionOverwrites: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory], deny: [PermissionFlagsBits.SendMessages] },
                    { id: verifiedRole.id, deny: [PermissionFlagsBits.ViewChannel] } // Hide after verified
                ]
            });

            const vEmbed = new EmbedBuilder()
                .setTitle('SERVER VERIFICATION')
                .setDescription('Welcome! Please use the `/verify` command or click the button below to gain access.')
                .setColor('#3498db');
            await verifyChan.send({ embeds: [vEmbed] });

            // 3. STAFF AREA (Private to Staff)
            const staffCat = await guild.channels.create({ 
                name: '🔐┃STAFF ONLY', 
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: staffRole.id, allow: [PermissionFlagsBits.ViewChannel] }
                ]
            });
            await guild.channels.create({ name: '🔨┃staff-chat', type: ChannelType.GuildText, parent: staffCat.id });
            await guild.channels.create({ name: '📜┃mod-logs', type: ChannelType.GuildText, parent: staffCat.id });

            // 4. MAIN TEMPLATE CHANNELS (Using your templates file)
            const data = templates[game];
            if (data) {
                for (const cat of data.categories) {
                    const category = await guild.channels.create({ name: cat.n, type: ChannelType.GuildCategory });
                    
                    for (const ch of cat.channels) {
                        await guild.channels.create({ 
                            name: ch.n, 
                            type: ChannelType.GuildText, 
                            parent: category.id,
                            permissionOverwrites: [
                                { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] }, // Unverified can't see
                                { id: verifiedRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] } // Members can
                            ]
                        });
                    }
                }
            }

            return interaction.editReply(`✅ **SERVER DEPLOYED.** Verified Role and Staff Area created with preset permissions.`);
        } catch (e) {
            console.error(e);
            return interaction.editReply('❌ Deployment failed. Check bot permissions.');
        }
    }
};
