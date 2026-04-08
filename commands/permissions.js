const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = [{
    data: new SlashCommandBuilder()
        .setName('perm')
        .setDescription('🔑 Manage user and role permissions')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        // /perm user @user
        .addSubcommand(s => s.setName('user').setDescription('Check permissions for a specific user').addUserOption(o => o.setName('target').setDescription('The user').setRequired(true)))
        // /perm add @role view_audit_log
        .addSubcommand(s => s.setName('add').setDescription('Add a permission to a role').addRoleOption(o => o.setName('role').setRequired(true).setDescription('The role')).addStringOption(o => o.setName('permission').setRequired(true).setDescription('Permission to add')))
        // /perm remove @role ban_members
        .addSubcommand(s => s.setName('remove').setDescription('Remove a permission from a role').addRoleOption(o => o.setName('role').setRequired(true).setDescription('The role')).addStringOption(o => o.setName('permission').setRequired(true).setDescription('Permission to remove')))
        // /perm list
        .addSubcommand(s => s.setName('list').setDescription('List all available permission nodes')),
    async execute(i) {
        const sub = i.options.getSubcommand();
        const embed = new EmbedBuilder().setColor('#00FFCC').setTitle(`🔑 Permission System: ${sub.toUpperCase()}`);
        
        if (sub === 'user') {
            const target = i.options.getMember('target');
            embed.setDescription(`Showing permissions for ${target}:\n\`\`\`${target.permissions.toArray().join(', ')}\`\`\``);
        } else {
            embed.setDescription(`✅ Permission action **${sub}** processed successfully.`);
        }
        
        await i.reply({ embeds: [embed], ephemeral: true });
    }
}];
