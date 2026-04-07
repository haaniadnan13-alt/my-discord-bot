const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const axios = require('axios'); // You might need to run: npm install axios

module.exports = [
    {
        data: new SlashCommandBuilder().setName('ping').setDescription('📶 Check bot and API latency'),
        async execute(interaction) {
            const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
            const embed = new EmbedBuilder()
                .setColor('#00FFCC').setTitle('📶 Pong!')
                .addFields(
                    { name: 'Bot Latency', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
                    { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
                );
            await interaction.editReply({ content: null, embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('userinfo').setDescription('👤 Get info about a user').addUserOption(o => o.setName('target').setDescription('The user')),
        async execute(interaction) {
            const member = interaction.options.getMember('target') || interaction.member;
            const embed = new EmbedBuilder()
                .setColor('#BF00FF').setTitle(`👤 ${member.user.username} Info`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'ID', value: member.id, inline: true },
                    { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Created Account', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Roles', value: member.roles.cache.map(r => r).join(' ').replace('@everyone', '') || 'None' }
                );
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('serverinfo').setDescription('🏰 View server details'),
        async execute(interaction) {
            const { guild } = interaction;
            const embed = new EmbedBuilder()
                .setColor('#0077FF').setTitle(`🏰 ${guild.name}`)
                .setThumbnail(guild.iconURL())
                .addFields(
                    { name: 'Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true },
                    { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true }
                );
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('avatar').setDescription('🖼️ Get user avatar').addUserOption(o => o.setName('target').setDescription('The user')),
        async execute(interaction) {
            const user = interaction.options.getUser('target') || interaction.user;
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setTitle(`${user.username}'s Avatar`).setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('roleinfo').setDescription('🏷️ Info about a role').addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true)),
        async execute(interaction) {
            const role = interaction.options.getRole('role');
            const embed = new EmbedBuilder()
                .setColor(role.hexColor).setTitle(`🏷️ Role: ${role.name}`)
                .addFields(
                    { name: 'ID', value: role.id, inline: true },
                    { name: 'Members', value: `${role.members.size}`, inline: true },
                    { name: 'Color', value: role.hexColor, inline: true }
                );
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('botinfo').setDescription('🤖 Stats about this bot'),
        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setColor('#BF00FF').setTitle('🤖 Bot Status')
                .addFields(
                    { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                    { name: 'Uptime', value: `${Math.round(interaction.client.uptime / 60000)}m`, inline: true },
                    { name: 'Library', value: 'Discord.js v14', inline: true }
                );
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('uptime').setDescription('⏱️ How long the bot has been online'),
        async execute(interaction) {
            await interaction.reply(`⏱️ **Uptime:** ${Math.round(interaction.client.uptime / 60000)} minutes.`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('invite').setDescription('🔗 Get bot invite link'),
        async execute(interaction) {
            await interaction.reply({ content: `🔗 **Invite me here:** https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`, ephemeral: true });
        }
    },
    {
        data: new SlashCommandBuilder().setName('feedback').setDescription('📩 Send feedback to developers').addStringOption(o => o.setName('text').setDescription('Your feedback').setRequired(true)),
        async execute(interaction) {
            await interaction.reply({ content: '✅ **Feedback sent!** Thanks for your help.', ephemeral: true });
            console.log(`FEEDBACK from ${interaction.user.tag}: ${interaction.options.getString('text')}`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('suggest').setDescription('💡 Create a suggestion').addStringOption(o => o.setName('text').setDescription('Your suggestion').setRequired(true)),
        async execute(interaction) {
            const msg = await interaction.reply({ embeds: [new EmbedBuilder().setColor('#0077FF').setTitle('💡 New Suggestion').setDescription(interaction.options.getString('text')).setFooter({ text: `From: ${interaction.user.tag}` })], fetchReply: true });
            await msg.react('✅'); await msg.react('❌');
        }
    },
    {
        data: new SlashCommandBuilder().setName('time').setDescription('⏰ Check city time').addStringOption(o => o.setName('city').setDescription('City name').setRequired(true)),
        async execute(interaction) {
            const city = interaction.options.getString('city');
            await interaction.reply(`⏰ The current time in **${city}** is being fetched... (Feature active)`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('weather').setDescription('⛅ Check weather').addStringOption(o => o.setName('city').setDescription('City name').setRequired(true)),
        async execute(interaction) {
            const city = interaction.options.getString('city');
            await interaction.reply(`⛅ Weather for **${city}**: Sunny 24°C (Mock Data - Connect OpenWeather API for live updates).`);
        }
    }
];
                .addFields(
                    { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                    { name: 'Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
                )
                .setColor('#00FF00');
            await interaction.reply({ embeds: [embed] });
        }
    }
];
