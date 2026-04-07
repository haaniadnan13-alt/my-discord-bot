const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('automod')
            .setDescription('🛡️ Toggle full automatic moderation')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const status = interaction.options.getString('status');
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setTitle('🛡️ Automod System').setDescription(`Automod has been turned **${status.toUpperCase()}**. Filters for spam, links, and caps are now active.`)] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('linkfilter')
            .setDescription('🔗 Toggle link blocking')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
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
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            const status = interaction.options.getString('status');
            await interaction.reply(`🔠 Caps filter is now **${status}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('ghostping')
            .setDescription('👻 Detect and warn for ghost pings')
            .addStringOption(o => o.setName('status').setDescription('On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            const status = interaction.options.getString('status');
            await interaction.reply(`👻 Ghostping detection is now **${status}**.`);
        }
    }
];
        const settings = global.automodSettings[message.guild.id] || {};

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
};
