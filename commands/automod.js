const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const spamMap = new Map();
// Ensure settings exist globally so the bot remembers them
if (!global.automodSettings) global.automodSettings = {};

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('automod')
            .setDescription('🛡️ Toggle bad word filtering')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices({ name: 'On', value: 'on' }, { name: 'Off', value: 'off' })),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const status = interaction.options.getString('status');
            const guildId = interaction.guild.id;
            if (!global.automodSettings[guildId]) global.automodSettings[guildId] = {};
            global.automodSettings[guildId].filter = (status === 'on');
            await interaction.reply(`🛡️ Bad word filter is now **${status.toUpperCase()}**.`);
        }
    },
    {
        name: 'messageCreate',
        async execute(message) {
            if (!message.guild || message.author.bot) return;

            const settings = global.automodSettings[message.guild.id] || {};

            // Bad Words Filter (Checks if turned ON)
            if (settings.filter === true) {
                const p = path.join(__dirname, './badwords.json'); // Adjusted path
                if (fs.existsSync(p)) {
                    const words = JSON.parse(fs.readFileSync(p, 'utf8'));
                    const content = message.content.toLowerCase();
                    
                    // Improved detection to prevent "false positives"
                    if (words.some(w => content.split(/\s+/).includes(w))) {
                        await message.delete().catch(() => null);
                        return message.channel.send(`🚫 ${message.author}, watch your language!`).then(m => setTimeout(() => m.delete(), 3000));
                    }
                }
            }
        }
    }
];
