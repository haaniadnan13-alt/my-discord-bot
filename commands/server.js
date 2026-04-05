// createserver command
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createserver')
        .setDescription('Creates a new server with specified settings'),
    async execute(interaction) {
        const serverName = interaction.options.getString('name');
        const rolesData = [
            { name: 'Admin', color: 'RED' },
            { name: 'Moderator', color: 'BLUE' },
            { name: 'Member', color: 'GREEN' }
        ];
        const categoriesData = ['General', 'Games', 'Music'];
        const channelsData = [
            { name: 'welcome', type: 'GUILD_TEXT' },
            { name: 'announcements', type: 'GUILD_TEXT' },
            { name: 'general', type: 'GUILD_TEXT' }
        ];
        const ranksData = [
            { name: 'Newbie', minLevel: 1 },
            { name: 'Experienced', minLevel: 5 },
            { name: 'Veteran', minLevel: 10 }
        ];

        // Logic to create server with the above data
        // For example:
        // let server = await client.guilds.create(serverName);
        // rolesData.forEach(async role => await server.roles.create({ data: role }));
        // categoriesData.forEach(async category => await server.channels.create({ name: category, type: 'GUILD_CATEGORY' }));
        // channelsData.forEach(async channel => await server.channels.create(channel));

        await interaction.reply(`Server **${serverName}** created successfully!`);
    },
};