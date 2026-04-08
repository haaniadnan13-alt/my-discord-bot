const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Staff Only: Delete the current support ticket.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        // Ensure this is a ticket channel
        if (!interaction.channel.name.startsWith('🎫-')) {
            return interaction.reply({ content: "❌ You can only use this in a ticket channel.", ephemeral: true });
        }

        // Creator cannot use /close (handled by PermissionFlagsBits.ManageMessages)
        await interaction.reply('🔒 **Closing ticket... Deleting channel in 5 seconds.**');
        
        // Final deletion
        setTimeout(() => interaction.channel.delete().catch(() => null), 5000);
    }
};
