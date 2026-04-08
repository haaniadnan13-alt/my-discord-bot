const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = [{
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎉 Manage server giveaways')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand(s => s.setName('start').setDescription('Start a giveaway').addStringOption(o => o.setName('prize').setRequired(true).setDescription('Prize')).addStringOption(o => o.setName('time').setRequired(true).setDescription('Duration (1h, 1d)')).addIntegerOption(o => o.setName('winners').setRequired(true).setDescription('Winner count')))
        .addSubcommand(s => s.setName('end').setDescription('End a giveaway').addStringOption(o => o.setName('id').setRequired(true).setDescription('Message ID')))
        .addSubcommand(s => s.setName('reroll').setDescription('Reroll winners').addStringOption(o => o.setName('id').setRequired(true).setDescription('Message ID')))
        .addSubcommand(s => s.setName('list').setDescription('List active giveaways'))
        .addSubcommand(s => s.setName('delete').setDescription('Delete a giveaway').addStringOption(o => o.setName('id').setRequired(true).setDescription('Message ID'))),
    async execute(i) {
        const sub = i.options.getSubcommand();
        await i.reply({ content: `✅ Giveaway **${sub}** executed!`, ephemeral: true });
    }
}];
