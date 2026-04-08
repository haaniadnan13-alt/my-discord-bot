const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const spamMap = new Map();
if (!global.automodSettings) global.automodSettings = {};

module.exports = [
    {
        data: new SlashCommandBuilder().setName('automod').setDescription('🛡️ Configure AutoMod')
            .addSubcommand(s => s.setName('toggle').setDescription('Enable/Disable filters')
                .addStringOption(o => o.setName('type').setDescription('Filter').setRequired(true).addChoices({name:'Bad Words', value:'filter'}, {name:'Links', value:'links'}, {name:'Spam', value:'spam'}, {name:'Self-Test (Affect Me)', value:'selfTest'}))
                .addBooleanOption(o => o.setName('status').setDescription('Status').setRequired(true)))
            .addSubcommand(s => s.setName('bypass').setDescription('Set role bypass')
                .addRoleOption(o => o.setName('role').setDescription('Role to bypass').setRequired(true))
                .addBooleanOption(o => o.setName('status').setDescription('Bypass status').setRequired(true))),
        async execute(i) {
            if (!i.member.permissions.has(PermissionFlagsBits.Administrator)) return i.reply({ content: '❌ Admin only!', ephemeral: true });
            const guildId = i.guild.id;
            if (!global.automodSettings[guildId]) global.automodSettings[guildId] = { bypassRoles: [] };
            
            if (i.options.getSubcommand() === 'toggle') {
                global.automodSettings[guildId][i.options.getString('type')] = i.options.getBoolean('status');
                return i.reply(`✅ **${i.options.getString('type')}** set to **${i.options.getBoolean('status')}**.`);
            } else {
                const roleId = i.options.getRole('role').id;
                const roles = global.automodSettings[guildId].bypassRoles;
                if (i.options.getBoolean('status')) { if (!roles.includes(roleId)) roles.push(roleId); }
                else { global.automodSettings[guildId].bypassRoles = roles.filter(r => r !== roleId); }
                return i.reply(`✅ Bypass for <@&${roleId}> set to **${i.options.getBoolean('status')}**.`);
            }
        }
    },
    {
        name: 'messageCreate',
        async execute(m) {
            if (!m.guild || m.author.bot) return;
            const s = global.automodSettings[m.guild.id] || { bypassRoles: [] };
            
            // BYPASS LOGIC: Only skip if NOT in selfTest mode
            if (!s.selfTest) {
                if (m.member.permissions.has(PermissionFlagsBits.Administrator) || m.member.roles.cache.some(r => s.bypassRoles.includes(r.id))) return;
            }

            const del = async (txt) => { await m.delete().catch(() => null); m.channel.send(`🚫 ${m.author}, ${txt}`).then(msg => setTimeout(() => msg.delete(), 3000)); };

            if (s.links && /(https?:\/\/[^\s]+)/g.test(m.content)) return del("links are not allowed!");
            if (s.spam) {
                const now = Date.now(), logs = spamMap.get(m.author.id) || [];
                logs.push(now);
                const recent = logs.filter(t => now - t < 5000);
                spamMap.set(m.author.id, recent);
                if (recent.length > 5) return del("stop spamming!");
            }
            if (s.filter) {
                const p = path.join(__dirname, './badwords.json');
                if (fs.existsSync(p)) {
                    const words = JSON.parse(fs.readFileSync(p, 'utf8'));
                    if (words.some(w => m.content.toLowerCase().split(/\s+/).includes(w))) return del("watch your language!");
                }
            }
        }
    }
];
