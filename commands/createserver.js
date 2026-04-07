const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField } = require('discord.js');
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
        const game = interaction.options.getString('game');
        const data = templates[game];
        const guild = interaction.guild;

        await interaction.reply({ content: `🚀 Assembling **${game.toUpperCase()}** template...`, ephemeral: true });

        try {
            const rolesMap = {};

            // 1. Create Staff Roles
            for (const s of data.staff) {
                rolesMap[s.name] = await guild.roles.create({ 
                    name: s.name, 
                    permissions: s.perms, 
                    color: '#2f3136',
                    reason: 'Template Setup'
                });
            }

            // 2. Create Ranks
            for (const r of data.ranks) {
                rolesMap[r] = await guild.roles.create({ name: r, color: '#5865f2' });
            }

            // 3. Create Others
            for (const o of data.others) {
                rolesMap[o] = await guild.roles.create({ name: o, color: '#99aab5' });
            }

            const verifiedRole = rolesMap["⭐ VERIFIED"];
            const staffRole = rolesMap[data.staff[0].name]; 

            // 4. Build Categories & Channels
            for (const catData of data.categories) {
                const category = await guild.channels.create({ 
                    name: catData.name, 
                    type: ChannelType.GuildCategory 
                });

                for (const chanName of catData.channels) {
                    const isVoice = chanName.includes('🎤') || chanName.includes('➕') || chanName.includes('🎧');
                    
                    const channel = await guild.channels.create({
                        name: chanName,
                        type: isVoice ? ChannelType.GuildVoice : ChannelType.GuildText,
                        parent: category.id
                    });

                    // 5. Permissions
                    const overwrites = [
                        { id: guild.id, deny: [PermissionFlagsBits.SendMessages] },
                        { id: staffRole.id, allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageChannels] }
                    ];

                    if (verifiedRole) {
                        if (chanName.includes('RULES') || chanName.includes('announcements') || chanName.includes('WELCOME')) {
                            overwrites.push({ id: verifiedRole.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] });
                        } else {
                            overwrites.push({ id: verifiedRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak] });
                        }
                    }

                    await channel.permissionOverwrites.set(overwrites);
                }
            }

            return interaction.followUp('✅ **SERVER ASSEMBLED.** Everything is set up according to the template.');
        } catch (err) {
            console.error(err);
            return interaction.followUp('❌ Error during assembly. Ensure the bot role is at the top.');
        }
    }
};
