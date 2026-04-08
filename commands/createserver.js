const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const templates = require('../server_new.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createserver')
        .setDescription('🛠️ Build a professional gaming server with precise permissions')
        .addStringOption(o => o.setName('game').setDescription('Select template').setRequired(true)
            .addChoices(
                { name: 'Rocket League', value: 'rl' },
                { name: 'Minecraft', value: 'mc' },
                { name: 'COD', value: 'cod' },
                { name: 'Apex', value: 'apex' },
                { name: 'Roblox', value: 'roblox' },
                { name: 'Roblox Rivals', value: 'rivals' }
            ))
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
        if (!data) return interaction.reply({ content: '❌ Template data missing.', ephemeral: true });

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
    try {
        const roles = [
            { n: '👑 OWNER', c: '#8B0000', p: [PermissionFlagsBits.Administrator] },
            { n: '🛠️ ADMIN', c: '#FF0000', p: [PermissionFlagsBits.Administrator] },
            { n: '⚙️ SUPPORT MANAGER', c: '#FFA500', p: [] },
            { n: '🛡️ SUPPORT MOD', c: '#FFFF00', p: [] },
            { n: 'MEMBER', c: '#FFFFFF', p: [] }
        ];

        const rolesMap = {};
        for (const r of roles) {
            rolesMap[r.n] = await guild.roles.create({ name: r.n, color: r.c, permissions: r.p });
        }

        const structure = [
            { cat: '📢┃INFORMATION', channels: [{ n: '📜┃rules', d: 'Support rules and ticket guidelines.' }, { n: '👋┃welcome', d: 'Join info and auto-role setup.' }, { n: '📌┃how-to-get-support', d: 'Ticket instructions.' }] },
            { cat: '💬┃GENERAL', channels: [{ n: '💬┃general-chat', d: 'Community discussion.' }, { n: '❓┃help', d: 'Quick assistance.' }, { n: '🐞┃bug-reports', d: 'Report issues here.' }] }
        ];

        for (const s of structure) {
            const category = await guild.channels.create({ name: s.cat, type: ChannelType.GuildCategory });
            for (const ch of s.channels) {
                const channel = await guild.channels.create({ name: ch.n, type: ChannelType.GuildText, parent: category.id });
                const embed = new EmbedBuilder()
                    .setTitle(ch.n.toUpperCase())
                    .setDescription(`**Description:** ${ch.d}`)
                    .setColor('#8B0000');
                await channel.send({ embeds: [embed] });
            }
        }

        const vCat = await guild.channels.create({ name: '🎧┃VOICE', type: ChannelType.GuildCategory });
        await guild.channels.create({ name: '🎤┃SUPPORT-VC', type: ChannelType.GuildVoice, parent: vCat.id });
        await guild.channels.create({ name: '➕┃CREATE-NEW-VC', type: ChannelType.GuildVoice, parent: vCat.id });

        return interaction.followUp('✅ **SUPPORT SERVER DEPLOYED.**');
    } catch (e) {
        return interaction.followUp('❌ Deployment failed.');
    }
}
