const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

if (!global.settings) global.settings = {};
if (!global.giveaways) global.giveaways = {};
if (!global.cmdPerms) global.cmdPerms = {};

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('welcome')
      .setDescription('Set a welcome message channel')
      .addChannelOption(o => o.setName('channel').setDescription('Channel for welcome messages').setRequired(true))
      .addStringOption(o => o.setName('message').setDescription('Welcome message (use {user} for mention)').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return interaction.reply({ content: '❌ You need Manage Channels permission!', ephemeral: true });
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      global.settings[interaction.guild.id] = { ...global.settings[interaction.guild.id], welcomeChannel: channel.id, welcomeMessage: message };
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('👋 Welcome Message Set!').setDescription(`Welcome messages will be sent in ${channel}!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('goodbye')
      .setDescription('Set a goodbye message channel')
      .addChannelOption(o => o.setName('channel').setDescription('Channel for goodbye messages').setRequired(true))
      .addStringOption(o => o.setName('message').setDescription('Goodbye message (use {user} for username)').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return interaction.reply({ content: '❌ You need Manage Channels permission!', ephemeral: true });
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      global.settings[interaction.guild.id] = { ...global.settings[interaction.guild.id], goodbyeChannel: channel.id, goodbyeMessage: message };
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('👋 Goodbye Message Set!').setDescription(`Goodbye messages will be sent in ${channel}!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('autorole')
      .setDescription('Set a role to give new members automatically')
      .addRoleOption(o => o.setName('role').setDescription('Role to assign').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return interaction.reply({ content: '❌ You need Manage Roles permission!', ephemeral: true });
      const role = interaction.options.getRole('role');
      global.settings[interaction.guild.id] = { ...global.settings[interaction.guild.id], autorole: role.id };
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('✅ Autorole Set!').setDescription(`New members will receive the **${role.name}** role!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('verify')
      .setDescription('Set up a verification system')
      .addRoleOption(o => o.setName('role').setDescription('Role to give after verification').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return interaction.reply({ content: '❌ You need Manage Roles permission!', ephemeral: true });
      const role = interaction.options.getRole('role');
      global.settings[interaction.guild.id] = { ...global.settings[interaction.guild.id], verifyRole: role.id };
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('verify_button').setLabel('✅ Verify').setStyle(ButtonStyle.Success)
      );
      await interaction.channel.send({ embeds: [new EmbedBuilder().setColor('Green').setTitle('✅ Verification').setDescription('Click the button below to verify yourself!')], components: [row] });
      interaction.reply({ content: '✅ Verification set up!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('Create a support ticket'),
    async execute(interaction) {
      const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
      if (existing) return interaction.reply({ content: '❌ You already have an open ticket!', ephemeral: true });
      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: interaction.guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
        ]
      });
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Close Ticket').setStyle(ButtonStyle.Danger)
      );
      await channel.send({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🎫 Support Ticket').setDescription(`Welcome <@${interaction.user.id}>! Describe your issue and staff will help you shortly.`)], components: [row] });
      interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('close')
      .setDescription('Close a ticket channel'),
    async execute(interaction) {
      if (!interaction.channel.name.startsWith('ticket-'))
        return interaction.reply({ content: '❌ This is not a ticket channel!', ephemeral: true });
      await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
      setTimeout(() => interaction.channel.delete(), 5000);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('announce')
      .setDescription('Send an announcement')
      .addChannelOption(o => o.setName('channel').setDescription('Channel to announce in').setRequired(true))
      .addStringOption(o => o.setName('message').setDescription('Announcement message').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.reply({ content: '❌ You need Manage Messages permission!', ephemeral: true });
      const channel = interaction.options.getChannel('channel');
      const message = interaction.options.getString('message');
      await channel.send({ embeds: [new EmbedBuilder().setColor('Gold').setTitle('📢 Announcement').setDescription(message).setFooter({ text: `Announced by ${interaction.user.tag}` })] });
      interaction.reply({ content: '✅ Announcement sent!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('poll')
      .setDescription('Create a poll')
      .addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true))
      .addStringOption(o => o.setName('option1').setDescription('Option 1').setRequired(true))
      .addStringOption(o => o.setName('option2').setDescription('Option 2').setRequired(true))
      .addStringOption(o => o.setName('option3').setDescription('Option 3'))
      .addStringOption(o => o.setName('option4').setDescription('Option 4')),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.reply({ content: '❌ You need Manage Messages permission!', ephemeral: true });
      const question = interaction.options.getString('question');
      const options = [
        interaction.options.getString('option1'),
        interaction.options.getString('option2'),
        interaction.options.getString('option3'),
        interaction.options.getString('option4'),
      ].filter(Boolean);
      const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
      const description = options.map((o, i) => `${emojis[i]} ${o}`).join('\n');
      const poll = await interaction.channel.send({ embeds: [new EmbedBuilder().setColor('Blue').setTitle(`📊 ${question}`).setDescription(description)] });
      for (let i = 0; i < options.length; i++) await poll.react(emojis[i]);
      interaction.reply({ content: '✅ Poll created!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('suggest')
      .setDescription('Submit a suggestion')
      .addStringOption(o => o.setName('suggestion').setDescription('Your suggestion').setRequired(true)),
    async execute(interaction) {
      const suggestion = interaction.options.getString('suggestion');
      const channel = interaction.guild.channels.cache.find(c => c.name === 'suggestions') || interaction.channel;
      const msg = await channel.send({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('💡 New Suggestion').setDescription(suggestion).setFooter({ text: `Suggested by ${interaction.user.tag}` })] });
      await msg.react('👍');
      await msg.react('👎');
      interaction.reply({ content: '✅ Suggestion submitted!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('reactionrole')
      .setDescription('Set up a reaction role')
      .addStringOption(o => o.setName('message_id').setDescription('Message ID to add reaction role to').setRequired(true))
      .addStringOption(o => o.setName('emoji').setDescription('Emoji to react with').setRequired(true))
      .addRoleOption(o => o.setName('role').setDescription('Role to assign').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles))
        return interaction.reply({ content: '❌ You need Manage Roles permission!', ephemeral: true });
      const messageId = interaction.options.getString('message_id');
      const emoji = interaction.options.getString('emoji');
      const role = interaction.options.getRole('role');
      const msg = await interaction.channel.messages.fetch(messageId);
      if (!msg) return interaction.reply({ content: '❌ Message not found!', ephemeral: true });
      await msg.react(emoji);
      if (!global.reactionRoles) global.reactionRoles = {};
      global.reactionRoles[`${messageId}-${emoji}`] = role.id;
      interaction.reply({ content: `✅ Reaction role set! React with ${emoji} to get **${role.name}**!`, ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('giveaway')
      .setDescription('Start a giveaway')
      .addStringOption(o => o.setName('prize').setDescription('Giveaway prize').setRequired(true))
      .addStringOption(o => o.setName('duration').setDescription('Duration e.g. 1h, 1d').setRequired(true)),
    async execute(interaction) {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
        return interaction.reply({ content: '❌ You need Manage Messages permission!', ephemeral: true });
      const prize = interaction.options.getString('prize');
      const duration = interaction.options.getString('duration');
      const ms = require('ms');
      const time = ms(duration);
      if (!time) return interaction.reply({ content: '❌ Invalid duration!', ephemeral: true });
      const ends = new Date(Date.now() + time);
      const msg = await interaction.channel.send({ embeds: [new EmbedBuilder().setColor('Gold').setTitle('🎉 Giveaway!').setDescription(`**Prize:** ${prize}\n**Ends:** <t:${Math.floor(ends.getTime() / 1000)}:R>\n\nReact with 🎉 to enter!`)] });
      await msg.react('🎉');
      global.giveaways[msg.id] = { prize, channelId: interaction.channel.id, ends };
      interaction.reply({ content: '✅ Giveaway started!', ephemeral: true });
      setTimeout(async () => {
        const updated = await msg.fetch();
        const reaction = updated.reactions.cache.get('🎉');
        const users = await reaction.users.fetch();
        const entries = users.filter(u => !u.bot);
        if (entries.size === 0) return interaction.channel.send('❌ No one entered the giveaway!');
        const win
