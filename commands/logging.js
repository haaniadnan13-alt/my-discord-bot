const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('setlogs')
            .setDescription('📜 Set the primary channel for global server monitoring')
            .addChannelOption(o => o.setName('channel').setDescription('The log channel').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            const channel = interaction.options.getChannel('channel');
            // Suggestion: Save channel.id to your database (e.g., db.set(`logs_${interaction.guild.id}`, channel.id))
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setDescription(`✅ **Global Logs Linked:** All enabled activity will now be reported in ${channel}.`)] });
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('logtoggle')
            .setDescription('🔧 Toggle advanced logging categories')
            .addStringOption(o => o.setName('category').setDescription('Select the system to monitor').setRequired(true).addChoices(
                { name: 'Tickets (Open/Close/Claim)', value: 'log_tickets' },
                { name: 'Messages (Edit/Delete/Purge)', value: 'log_messages' },
                { name: 'Members (Join/Leave/Nicknames)', value: 'log_members' },
                { name: 'Moderation (Ban/Kick/Mute)', value: 'log_mod' },
                { name: 'Roles & Channels (Created/Updated)', value: 'log_structure' },
                { name: 'Voice (Join/Leave/Move/Mute)', value: 'log_voice' },
                { name: 'Server (Icon/Invite/Level Up)', value: 'log_server' }
            ))
            .addStringOption(o => o.setName('status').setDescription('Turn category On or Off').setRequired(true).addChoices(
                { name: 'On', value: 'on' },
                { name: 'Off', value: 'off' }
            )),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            
            const category = interaction.options.getString('category');
            const status = interaction.options.getString('status');
            
            // Database logic here: db.set(`${category}_${interaction.guild.id}`, status)

            const embed = new EmbedBuilder()
                .setTitle('📡 System Monitor Updated')
                .setDescription(`Monitoring for **${category.replace('log_', '').toUpperCase()}** is now **${status.toUpperCase()}**.`)
                .addFields({ name: 'Requirement', value: 'The bot will only report these events if the relevant channels exist in the server.', inline: false })
                .setColor(status === 'on' ? '#43b581' : '#f04747')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
];

/* LOGIC NOTE FOR YOUR EVENT HANDLER (index.js):
   When logging tickets, use a check like this:
   
   const ticketChannel = guild.channels.cache.find(c => c.name.includes('ticket'));
   if (ticketChannel) {
       // Proceed with logging the ticket close/open
   }
*/
