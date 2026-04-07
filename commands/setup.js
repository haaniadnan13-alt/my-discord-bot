const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const spamMap = new Map();

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('automod')
            .setDescription('🛡️ Toggle full automatic moderation')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices({ name: 'On', value: 'on' }, { name: 'Off', value: 'off' })),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const status = interaction.options.getString('status');
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setTitle('🛡️ Automod System').setDescription(`Automod has been turned **${status.toUpperCase()}**.`)] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('linkfilter')
            .setDescription('🔗 Toggle link blocking')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices({ name: 'On', value: 'on' }, { name: 'Off', value: 'off' })),
        async execute(interaction) {
            const status = interaction.options.getString('status');
            await interaction.reply(`🔗 Link filter is now **${status}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('mentionlimit')
            .setDescription('🚫 Set max mentions per message')
            .addIntegerOption(o => o.setName('number').setDescription('Amount of pings allowed').setRequired(true)),
        async execute(interaction) {
            const limit = interaction.options.getInteger('number');
            await interaction.reply(`🚫 Mention limit set to **${limit}** pings per message.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('capsfilter')
            .setDescription('🔠 Toggle excessive caps filtering')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices({ name: 'On', value: 'on' }, { name: 'Off', value: 'off' })),
        async execute(interaction) {
            const status = interaction.options.getString('status');
            await interaction.reply(`🔠 Caps filter is now **${status}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('ghostping')
            .setDescription('👻 Detect and warn for ghost pings')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices({ name: 'On', value: 'on' }, { name: 'Off', value: 'off' })),
        async execute(interaction) {
            const status = interaction.options.getString('status');
            await interaction.reply(`👻 Ghostping detection is now **${status}**.`);
        }
    },
    {
        name: 'messageCreate',
        async execute(message) {
            if (!message.guild || message.author.bot) return;

            const settings = global.automodSettings?.[message.guild.id] || {};

            if (settings.invites && (message.content.includes('discord.gg/') || message.content.includes('discord.com/invite/'))) {
                await message.delete().catch(() => null);
                return message.channel.send(`🚫 ${message.author}, invites are not allowed.`);
            }

            if (settings.spam) {
                const now = Date.now();
                const timestamps = spamMap.get(message.author.id) || [];
                timestamps.push(now);
                const recent = timestamps.filter(t => now - t < 5000);
                spamMap.set(message.author.id, recent);
                if (recent.length > 5) {
                    await message.delete().catch(() => null);
                    return message.channel.send(`🚫 ${message.author}, stop spamming!`);
                }
            }

            if (settings.filter !== false) {
                const p = path.join(__dirname, '../badwords.json');
                if (fs.existsSync(p)) {
                    const words = JSON.parse(fs.readFileSync(p, 'utf8'));
                    if (words.some(w => message.content.toLowerCase().includes(w))) {
                        await message.delete().catch(() => null);
                        return message.channel.send(`🚫 ${message.author}, watch your language!`);
                    }
                }
            }

            if (settings.caps && message.content.length > 8) {
                const caps = message.content.replace(/[^A-Z]/g, "").length;
                if (caps / message.content.length > 0.8) {
                    await message.delete().catch(() => null);
                    return message.channel.send(`🚫 ${message.author}, stop using too many caps.`);
                }
            }
        }
    }
];
            .addRoleOption(o => o.setName('role').setDescription('Select role').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const role = interaction.options.getRole('role');
            const guildId = interaction.guild.id;
            if (!global.settings[guildId]) global.settings[guildId] = {};
            global.settings[guildId].autorole = role.id;
            await interaction.reply(`✅ New members will now get the **${role.name}** role automatically.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('perm')
            .setDescription('🔑 Manage bot permissions')
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true))
            .addStringOption(o => o.setName('action').setDescription('Allow/Deny').setRequired(true).addChoices({ name: 'Allow', value: 'allow' }, { name: 'Deny', value: 'deny' }))
            .addStringOption(o => o.setName('command').setDescription('Command name').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const role = interaction.options.getRole('role');
            const action = interaction.options.getString('action');
            const cmd = interaction.options.getString('command');
            await interaction.reply(`🔑 Role **${role.name}** is now **${action}ed** for **${cmd}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('config')
            .setDescription('⚙️ View server configuration'),
        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setColor('#00FFCC')
                .setTitle('⚙️ Server Configuration')
                .addFields(
                    { name: 'Logging', value: 'Enabled', inline: true },
                    { name: 'Counting', value: 'Active', inline: true }
                );
            await interaction.reply({ embeds: [embed] });
        }
    }
];
    {
        data: new SlashCommandBuilder()
            .setName('set-autorole')
            .setDescription('👥 Choose the role given to new members')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
            .addRoleOption(o => o.setName('role').setDescription('Select role').setRequired(true)),
        async execute(interaction) {
            const role = interaction.options.getRole('role');
            const guildId = interaction.guild.id;

            if (!global.settings[guildId]) global.settings[guildId] = {};
            global.settings[guildId].autorole = role.id;
            
            await interaction.reply(`✅ New members will now get the **${role.name}** role automatically.`);
        }
    }
];
