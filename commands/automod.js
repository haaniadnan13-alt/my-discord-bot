const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

if (!global.automodSettings) global.automodSettings = {};
const spamMap = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('🛡️ Security Settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(o => o.setName('module').setDescription('Select module').setRequired(true).addChoices(
            { name: 'Word Filter', value: 'filter' },
            { name: 'Anti-Invite', value: 'invites' },
            { name: 'Anti-Spam', value: 'spam' },
            { name: 'Anti-Caps', value: 'caps' }
        ))
        .addStringOption(o => o.setName('status').setDescription('On/Off').setRequired(true).addChoices(
            { name: 'On', value: 'on' },
            { name: 'Off', value: 'off' }
        )),

    async execute(interaction) {
        const mod = interaction.options.getString('module');
        const state = interaction.options.getString('status') === 'on';
        const guildId = interaction.guild.id;

        if (!global.automodSettings[guildId]) global.automodSettings[guildId] = {};
        global.automodSettings[guildId][mod] = state;

        await interaction.reply({ content: `✅ **${mod}** protection is now **${state ? 'ENABLED' : 'DISABLED'}**.`, ephemeral: true });
    },

    async handle(message) {
        if (message.author.bot || !message.guild || message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return;
        const settings = global.automodSettings[message.guild.id] || {};

        // 1. Anti-Invite
        if (settings.invites && (message.content.includes('discord.gg/') || message.content.includes('discord.com/invite/'))) {
            await message.delete().catch(() => null);
            return message.channel.send(`🚫 ${message.author}, invites are not allowed.`);
        }

        // 2. Anti-Spam (5 msgs in 5 seconds)
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

        // 3. Word Filter (Reads badwords.json)
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

        // 4. Anti-Caps (80% caps check)
        if (settings.caps && message.content.length > 8) {
            const caps = message.content.replace(/[^A-Z]/g, "").length;
            if (caps / message.content.length > 0.8) {
                await message.delete().catch(() => null);
                return message.channel.send(`🚫 ${message.author}, stop using too many caps.`);
            }
        }
    }
};
        const settings = global.automodSettings[message.guild.id] || {};

        // 1. Anti-Invite
        if (settings.invites && (message.content.includes('discord.gg/') || message.content.includes('discord.com/invite/'))) {
            await message.delete().catch(() => null);
            return message.channel.send(`🚫 ${message.author}, invites are not allowed.`);
        }

        // 2. Anti-Spam
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

        // 3. Word Filter (Reads badwords.json)
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

        // 4. Anti-Caps
        if (settings.caps && message.content.length > 8) {
            const caps = message.content.replace(/[^A-Z]/g, "").length;
            if (caps / message.content.length > 0.8) {
                await message.delete().catch(() => null);
                return message.channel.send(`🚫 ${message.author}, stop using too many caps.`);
            }
        }
    }
};
