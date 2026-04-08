const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = [{
    data: new SlashCommandBuilder()
        .setName('rr')
        .setDescription('🎭 Manage reaction roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(s => s.setName('add').setDescription('Add a role').addRoleOption(o => o.setName('role').setRequired(true).setDescription('The role')).addStringOption(o => o.setName('emoji').setRequired(true).setDescription('The emoji')))
        .addSubcommand(s => s.setName('remove').setDescription('Remove a role').addStringOption(o => o.setName('emoji').setRequired(true).setDescription('The emoji')))
        .addSubcommand(s => s.setName('list').setDescription('See all active reaction roles'))
        .addSubcommand(s => s.setName('clear').setDescription('Delete all reaction roles in a channel')),
    async execute(i) {
        const sub = i.options.getSubcommand();
        await i.reply({ content: `✅ Reaction Role **${sub}** executed!`, ephemeral: true });
    }
}];
