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
            const guildId = interaction.guild.id;
            if (!global.automodSettings[guildId]) global.automodSettings[guildId] = {};
            global.automodSettings[guildId].active = (status === 'on');
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
            const guildId = interaction.guild.id;
            if (!global.automodSettings[guildId]) global.automodSettings[guildId] = {};
            global.automodSettings[guildId].invites = (status === 'on');
            await interaction.reply(`🔗 Link filter is now **${status.toUpperCase()}**.`);
        }
    },
    {
        name: 'messageCreate',
        async execute(message) {
            if (!message.guild || message.author.bot) return;

            const settings = global.automodSettings[message.guild.id] || {};

            // Link Filter
            if (settings.invites && (message.content.includes('discord.gg/') || message.content.includes('discord.com/invite/'))) {
                await message.delete().catch(() => null);
                return message.channel.send(`🚫 ${message.author}, invites are not allowed.`);
            }

            // Spam Filter
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

            // Bad Words Filter
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
        }
    }
];
