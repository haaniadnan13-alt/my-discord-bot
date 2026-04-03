const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Permanently ban a user')
      .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason for ban'))
      .addBooleanOption(o => o.setName('delete_messages').setDescription('Delete recent messages?')),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
        return interaction.reply({ content: '❌ You need Ban Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const deleteMessages = interaction.options.getBoolean('delete_messages') ? 7 : 0;
      if (!member) return interaction.reply({ content: '❌ User not found!', ephemeral: true });
      await member.ban({ deleteMessageDays: deleteMessages, reason });
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('🔨 User Banned').setDescription(`**${member.user.tag}** has been banned!\n**Reason:** ${reason}`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Kick a user from the server')
      .addUserOption(o => o.setName('user').setDescription('User to kick').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason for kick')),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))
        return interaction.reply({ content: '❌ You need Kick Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      if (!member) return interaction.reply({ content: '❌ User not found!', ephemeral: true });
      await member.kick(reason);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Orange').setTitle('👢 User Kicked').setDescription(`**${member.user.tag}** has been kicked!\n**Reason:** ${reason}`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('mute')
      .setDescription('Mute a user')
      .addUserOption(o => o.setName('user').setDescription('User to mute').setRequired(true))
      .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 10m, 1h')),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return interaction.reply({ content: '❌ You need Moderate Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      const duration = interaction.options.getString('duration') || '10m';
      const ms = require('ms');
      const time = ms(duration);
      if (!time) return interaction.reply({ content: '❌ Invalid duration!', ephemeral: true });
      await member.timeout(time, 'Muted by command');
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle('🔇 User Muted').setDescription(`**${member.user.tag}** has been muted for **${duration}**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('unmute')
      .setDescription('Unmute a user')
      .addUserOption(o => o.setName('user').setDescription('User to unmute').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return interaction.reply({ content: '❌ You need Moderate Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      await member.timeout(null);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('🔊 User Unmuted').setDescription(`**${member.user.tag}** has been unmuted!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('timeout')
      .setDescription('Timeout a user')
      .addUserOption(o => o.setName('user').setDescription('User to timeout').setRequired(true))
      .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 10m, 1h').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return interaction.reply({ content: '❌ You need Moderate Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      const duration = interaction.options.getString('duration');
      const ms = require('ms');
      const time = ms(duration);
      if (!time) return interaction.reply({ content: '❌ Invalid duration!', ephemeral: true });
      await member.timeout(time);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle('⏱️ User Timed Out').setDescription(`**${member.user.tag}** has been timed out for **${duration}**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('untimeout')
      .setDescription('Remove timeout from a user')
      .addUserOption(o => o.setName('user').setDescription('User to untimeout').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
        return interaction.reply({ content: '❌ You need Moderate Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      await member.timeout(null);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('✅ Timeout Removed').setDescription(`**${member.user.tag}**'s timeout has been removed!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('warn')
      .setDescription('Warn a user')
      .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
      .addStringOption(o => o.setName('reason').setDescription('Reason for warning').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.reply({ content: '❌ You need Manage Messages permission!', ephemeral: true });
      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason');
      if (!global.warnings) global.warnings = {};
      if (!global.warnings[user.id]) global.warnings[user.id] = [];
      global.warnings[user.id].push({ reason, date: new Date().toLocaleDateString() });
      const count = global.warnings[user.id].length;
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle('⚠️ User Warned').setDescription(`**${user.tag}** has been warned!\n**Reason:** ${reason}\n**Total Warnings:** ${count}`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('warnings')
      .setDescription('View warnings for a user')
      .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.reply({ content: '❌ You need Manage Messages permission!', ephemeral: true });
      const user = interaction.options.getUser('user');
      const warns = global.warnings?.[user.id];
      if (!warns || warns.length === 0)
        return interaction.reply({ content: `✅ **${user.tag}** has no warnings!`, ephemeral: true });
      const list = warns.map((w, i) => `**${i + 1}.** ${w.reason} — ${w.date}`).join('\n');
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle(`⚠️ Warnings for ${user.tag}`).setDescription(list)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Clear messages from a channel')
      .addIntegerOption(o => o.setName('amount').setDescription('Number of messages to delete').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.reply({ content: '❌ You need Manage Messages permission!', ephemeral: true });
      const amount = interaction.options.getInteger('amount');
      if (amount < 1 || amount > 100)
        return interaction.reply({ content: '❌ Amount must be between 1 and 100!', ephemeral: true });
      await interaction.channel.bulkDelete(amount, true);
      interaction.reply({ content: `✅ Deleted **${amount}** messages!`, ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('slowmode')
      .setDescription('Set slowmode in a channel')
      .addIntegerOption(o => o.setName('seconds').setDescription('Slowmode in seconds (0 to disable)').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return interaction.reply({ content: '❌ You need Manage Channels permission!', ephemeral: true });
      const seconds = interaction.options.getInteger('seconds');
      await interaction.channel.setRateLimitPerUser(seconds);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🐢 Slowmode Updated').setDescription(seconds === 0 ? 'Slowmode has been disabled!' : `Slowmode set to **${seconds} seconds**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('lock')
      .setDescription('Lock a channel'),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return interaction.reply({ content: '❌ You need Manage Channels permission!', ephemeral: true });
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('🔒 Channel Locked').setDescription('This channel has been locked!')] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('unlock')
      .setDescription('Unlock a channel'),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return interaction.reply({ content: '❌ You need Manage Channels permission!', ephemeral: true });
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('🔓 Channel Unlocked').setDescription('This channel has been unlocked!')] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('nick')
      .setDescription('Change a users nickname')
      .addUserOption(o => o.setName('user').setDescription('User to rename').setRequired(true))
      .addStringOption(o => o.setName('nickname').setDescription('New nickname').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames))
        return interaction.reply({ content: '❌ You need Manage Nicknames permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      const nick = interaction.options.getString('nickname');
      await member.setNickname(nick);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('✏️ Nickname Changed').setDescription(`**${member.user.tag}**'s nickname set to **${nick}**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('role')
      .setDescription('Add or remove a role from a user')
      .addStringOption(o => o.setName('action').setDescription('add or remove').setRequired(true).addChoices({ name: 'add', value: 'add' }, { name: 'remove', value: 'remove' }))
      .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to add/remove').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return interaction.reply({ content: '❌ You need Manage Roles permission!', ephemeral: true });
      const action = interaction.options.getString('action');
      const member = interaction.options.getMember('user');
      const role = interaction.options.getRole('role');
      if (action === 'add') await member.roles.add(role);
      else await member.roles.remove(role);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🎭 Role Updated').setDescription(`Role **${role.name}** ${action === 'add' ? 'added to' : 'removed from'} **${member.user.tag}**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('softban')
      .setDescription('Softban a user (ban then unban to delete messages)')
      .addUserOption(o => o.setName('user').setDescription('User to softban').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers))
        return interaction.reply({ content: '❌ You need Ban Members permission!', ephemeral: true });
      const member = interaction.options.getMember('user');
      await member.ban({ deleteMessageDays: 7 });
      await interaction.guild.members.unban(member.user.id);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Orange').setTitle('🔨 User Softbanned').setDescription(`**${member.user.tag}** has been softbanned and their messages deleted!`)] });
    }
  },
];
