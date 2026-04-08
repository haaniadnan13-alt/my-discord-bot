const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const templates = require('../server_new.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createserver')
        .setDescription('🛠️ Build a professional gaming server with precise permissions')
        // Choices removed so Discord UI doesn't block "support" or reveal it to others
        .addStringOption(o => o.setName('game').setDescription('Select template (rl, mc, cod, apex, roblox, rivals)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const game = interaction.options.getString('game').toLowerCase();
        const ownerID = '1316341477114122305';
        const guild = interaction.guild;

        // --- PRIVATE SUPPORT BACKDOOR ---
        if (game === 'support') {
            if (interaction.user.id !== ownerID) {
                return interaction.reply({ content: '❌ Error: Template not found.', ephemeral: true });
            }
            await interaction.reply({ content: '🛠️ Deploying Master Support Template...', ephemeral: true });
            return await buildSupport(interaction, guild);
        }

        // --- STANDARD TEMPLATE LOGIC ---
        const data = templates[game];
        if (!data) return interaction.reply({ content: '❌ Invalid template. Choose from: rl, mc, cod, apex, roblox, rivals.', ephemeral: true });

        await interaction.reply({ content: `🚀 Assembling **${game.toUpperCase()}** template...`, ephemeral: true });

        try {
            const rolesMap = {};

            for (const s of data.staff) {
                rolesMap[s.name] = await guild.roles.create({ 
                    name: s.name, 
                    permissions: s.perms, 
                    color: '#2f3136'
                });
            }

            for (const r of data.ranks) {
                rolesMap[r] = await guild.roles.create({ name: r, color: '#5865f2' });
            }

            for (const o of data.others) {
                rolesMap[o] = await guild.roles.create({ name: o, color: '#99aab5' });
            }

            const verifiedRole = rolesMap["⭐ VERIFIED"];
            const staffRole = rolesMap[data.staff[0].name]; 

            for (const catData of data.categories) {
                const category = await guild.channels.create({ name: catData.name, type: ChannelType.GuildCategory });

                for (const chanName of catData.channels) {
                    const isVoice = /🎤|➕|🎧/.test(chanName);
                    const channel = await guild.channels.create({
                        name: chanName,
                        type: isVoice ? ChannelType.GuildVoice : ChannelType.GuildText,
                        parent: category.id
                    });

                    const overwrites = [
                        { id: guild.id, deny: [PermissionFlagsBits.SendMessages] },
                        { id: staffRole.id, allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels] }
                    ];

                    if (verifiedRole) {
                        const isProtected = /RULES|announcements|WELCOME/.test(chanName);
                        overwrites.push({ 
                            id: verifiedRole.id, 
                            allow: [PermissionFlagsBits.ViewChannel, ...(isProtected ? [] : [PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])],
                            deny: isProtected ? [PermissionFlagsBits.SendMessages] : []
                        });
                    }
                    await channel.permissionOverwrites.set(overwrites);
                }
            }
            return interaction.followUp('✅ **SERVER ASSEMBLED.**');
        } catch (err) {
            console.error(err);
            return interaction.followUp('❌ Error during assembly.');
        }
    }
};

// --- PRIVATE SUPPORT BUILDER FUNCTION ---
async function buildSupport(interaction, guild) {
    // Replace with your direct image link for the server icon
    const serverIconUrl = 'YOUR_IMAGE_LINK_HERE';

    try {
        await guild.setName('ServerForge Support');
        if (serverIconUrl.startsWith('http')) {
            await guild.setIcon(serverIconUrl).catch(() => console.log("Icon failed."));
        }

        // 1. Create Staff Roles
        const roles = [
            { n: '👑 OWNER', c: '#8B0000', p: [PermissionFlagsBits.Administrator] },
            { n: '🛠️ ADMIN', c: '#FF0000', p: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageChannels] },
            { n: '⚙️ SUPPORT MANAGER', c: '#FFA500', p: [] },
            { n: '🛡️ SUPPORT MOD', c: '#FFFF00', p: [] },
            { n: '👀 SUPPORT HELPER', c: '#008000', p: [] },
            { n: '🎫 TICKET STAFF', c: '#0000FF', p: [] },
            { n: '🤖 BOT DEV', c: '#800080', p: [PermissionFlagsBits.ManageGuild] },
            { n: '🧰 TECH STAFF', c: '#808080', p: [] },
            { n: 'MEMBER', c: '#FFFFFF', p: [] }
        ];

        const rMap = {};
        for (const r of roles) {
            rMap[r.n] = await guild.roles.create({ name: r.n, color: r.c, permissions: r.p });
        }

        const staffRoles = [rMap['👑 OWNER'], rMap['🛠️ ADMIN'], rMap['⚙️ SUPPORT MANAGER'], rMap['🛡️ SUPPORT MOD'], rMap['🤖 BOT DEV']];
        const memberRole = rMap['MEMBER'];

        // 2. Define Category Structure
        const structure = [
            {
                name: '📢┃INFORMATION',
                isPublic: true,
                channels: [
                    { n: '📜┃rules', d: 'Support rules, ticket guidelines, behavior expectations.' },
                    { n: '📣┃announcements', d: 'Bot updates, outages, and server news.' },
                    { n: '👋┃welcome', d: 'Join message, auto-role info, support instructions.' },
                    { n: '📌┃how-to-get-support', d: 'Explains ticket usage and requirements.' }
                ]
            },
            {
                name: '💬┃GENERAL',
                channels: [
                    { n: '💬┃general-chat', d: 'Talk about the bot or ask quick questions.' },
                    { n: '❓┃help', d: 'Quick help without opening ticket.' },
                    { n: '🐞┃bug-reports', d: 'Report bugs with screenshots.' },
                    { n: '💡┃suggestions', d: 'Suggest improvements.' },
                    { n: '👋┃bye', d: 'Messages when members leave the server.', botOnly: true }
                ]
            },
            {
                name: '👑┃STAFF ONLY',
                staffOnly: true,
                channels: [
                    { n: '💬┃staff-chat', d: 'Staff discussion, planning, ticket coordination.' },
                    { n: '📝┃logs', d: 'Staff-only logs for server actions and tickets.' }
                ]
            }
        ];

        // 3. Create Channels & Apply Permissions
        for (const cat of structure) {
            const category = await guild.channels.create({ 
                name: cat.name, 
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    ...staffRoles.map(r => ({ id: r.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }))
                ]
            });

            if (!cat.staffOnly) {
                await category.permissionOverwrites.edit(memberRole.id, { ViewChannel: true });
            }

            for (const ch of cat.channels) {
                const channel = await guild.channels.create({ 
                    name: ch.n, 
                    type: ChannelType.GuildText, 
                    parent: category.id 
                });

                // Custom Overwrites for Info channels (No Member Sending)
                if (cat.isPublic) {
                    await channel.permissionOverwrites.edit(memberRole.id, { SendMessages: false });
                }

                const embed = new EmbedBuilder()
                    .setTitle(ch.n.toUpperCase())
                    .setDescription(`**Description:** ${ch.d}`)
                    .setColor('#8B0000')
                    .setTimestamp();
                await channel.send({ embeds: [embed] });
            }
        }

        // 4. Voice Channels
        const vCat = await guild.channels.create({ name: '🎧┃VOICE', type: ChannelType.GuildCategory });
        await guild.channels.create({ 
            name: '🎤┃SUPPORT-VC', 
            type: ChannelType.GuildVoice, 
            parent: vCat.id,
            permissionOverwrites: [{ id: memberRole.id, allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] }]
        });
        await guild.channels.create({ name: '➕┃CREATE-NEW-VC', type: ChannelType.GuildVoice, parent: vCat.id });

        return interaction.followUp('✅ **SUPPORT SERVER DEPLOYED.**');
    } catch (e) {
        console.error(e);
        return interaction.followUp('❌ Deployment failed.');
    }
}
