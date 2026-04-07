const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('role')
            .setDescription('🔧 Manage roles for a user')
            .addSubcommand(sub => sub.setName('add').setDescription('Add a role').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true)))
            .addSubcommand(sub => sub.setName('remove').setDescription('Remove a role').addUserOption(o => o.setName('user').setDescription('The user').setRequired(true)).addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true))),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const sub = interaction.options.getSubcommand();
            const member = interaction.options.getMember('user');
            const role = interaction.options.getRole('role');
            if (sub === 'add') await member.roles.add(role);
            else await member.roles.remove(role);
            await interaction.reply(`✅ Successfully ${sub}ed **${role.name}**.`);
        }
    },
      {
        data: new SlashCommandBuilder()
            .setName('rolecolor')
            .setDescription('🎨 Change a roles color')
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true))
            .addStringOption(o => o.setName('hex').setDescription('Hex code (e.g. #00FFCC)').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: '❌ No perms!', ephemeral: true });
            const role = interaction.options.getRole('role');
            const color = interaction.options.getString('hex');
            await role.setColor(color);
            await interaction.reply(`🎨 Role **${role.name}** color changed to **${color}**.`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('massrole')
            .setDescription('👥 Give a role to everyone')
            .addRoleOption(o => o.setName('role').setDescription('The role').setRequired(true)),
        async execute(interaction) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: '❌ Admin only!', ephemeral: true });
            await interaction.reply('👥 Adding roles to everyone... this takes a moment.');
            const role = interaction.options.getRole('role');
            const members = await interaction.guild.members.fetch();
            members.forEach(m => m.roles.add(role).catch(() => {}));
        }
    }
];
