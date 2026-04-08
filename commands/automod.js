const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const spamMap = new Map();
if (!global.automodSettings) global.automodSettings = {};

module.exports = [
    {
        data: new SlashCommandBuilder().setName('automod').setDescription('🛡️ AutoMod Settings')
            .addStringOption(o => o.setName('action').setDescription('Toggle feature').setRequired(true)
                .addChoices({name:'Bad Words', value:'filter'}, {name:'Links', value:'invites'}, {name:'Spam', value:'spam'}))
            .addBooleanOption(o => o.setName('status').setDescription('Enable/Disable').setRequired(true)),
        async execute(i) {
            if (!i.member.permissions.has(PermissionFlagsBits.Administrator)) return i.reply('❌ Admin only!');
            if (!global.automodSettings[i.guild.id]) global.automodSettings[i.guild.id] = {};
            global.automodSettings[i.guild.id][i.options.getString('action')] = i.options.getBoolean('status');
            await i.reply(`✅ **${i.options.getString('action')}** is now **${i.options.getBoolean('status')}**.`);
        }
    },
    {
        name: 'messageCreate',
        async execute(m) {
            if (!m.guild || m.author.bot || m.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return;
            const s = global.automodSettings[m.guild.id] || {};

            // Link/Invite Filter
            if (s.invites && /(discord\.gg\/|discord\.com\/invite\/)/g.test(m.content)) {
                return m.delete().then(() => m.channel.send(`🚫 ${m.author}, no invites!`));
            }

            // Bad Words Filter - FIXED PATH
            if (s.filter !== false) {
                const p = path.join(__dirname, './badwords (1).json'); // Matches your uploaded filename
                if (fs.existsSync(p)) {
                    const words = JSON.parse(fs.readFileSync(p, 'utf8'));
                    if (words.some(w => m.content.toLowerCase().includes(w.toLowerCase()))) {
                        return m.delete().then(() => m.channel.send(`🚫 ${m.author}, watch your language!`));
                    }
                }
            }
        }
    }
];
