require('./keep_alive');
const { Client, GatewayIntentBits, Partials, REST, Routes, EmbedBuilder } = require('discord.js');
const { handleCreateServerSelect } = require('./commands/server');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
let allCommands = [];
let commandMap = new Map();

const commandFiles = ['moderation', 'utility', 'fun', 'server'];
for (const file of commandFiles) {
  const imported = require(`./commands/${file}`);
  const commands = Array.isArray(imported) ? imported : (imported.data ? [imported] : []);
  for (const cmd of commands) {
    if (cmd.data && cmd.execute) {
      allCommands.push(cmd.data.toJSON());
      commandMap.set(cmd.data.name, cmd);
    }
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  await rest.put(Routes.applicationCommands(client.user.id), { body: allCommands });
  console.log(`✅ Registered ${allCommands.length} slash commands!`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = commandMap.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(err);
      if (!interaction.replied) interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }

  if (interaction.isStringSelectMenu()) {
    try {
      await handleCreateServerSelect(interaction);
    } catch (err) {
      console.error('Select menu error:', err);
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      const settings = global.settings?.[interaction.guild.id];
      if (!settings?.verifyRole) return interaction.reply({ content: '❌ Verification not set up!', ephemeral: true });
      const role = interaction.guild.roles.cache.get(settings.verifyRole);
      await interaction.member.roles.add(role);
      interaction.reply({ content: '✅ You have been verified!', ephemeral: true });
    }
    if (interaction.customId === 'close_ticket') {
      await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
      setTimeout(() => interaction.channel.delete(), 5000);
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  const settings = global.settings?.[member.guild.id];
  if (settings?.welcomeChannel) {
    const channel = member.guild.channels.cache.get(settings.welcomeChannel);
    if (channel) {
      const msg = settings.welcomeMessage.replace('{user}', `<@${member.user.id}>`);
      channel.send({ embeds: [new EmbedBuilder().setColor('Green').setTitle('👋 Welcome!').setDescription(msg).setThumbnail(member.user.displayAvatarURL())] });
    }
  }
  if (settings?.autorole) {
    const role = member.guild.roles.cache.get(settings.autorole);
    if (role) await member.roles.add(role);
  }
});

client.on('guildMemberRemove', async (member) => {
  const settings = global.settings?.[member.guild.id];
  if (settings?.goodbyeChannel) {
    const channel = member.guild.channels.cache.get(settings.goodbyeChannel);
    if (channel) {
      const msg = settings.goodbyeMessage.replace('{user}', member.user.username);
      channel.send({ embeds: [new EmbedBuilder().setColor('Red').setTitle('👋 Goodbye!').setDescription(msg)] });
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  const key = `${reaction.message.id}-${reaction.emoji.name}`;
  const roleId = global.reactionRoles?.[key];
  if (roleId) {
    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.get(roleId);
    if (role) await member.roles.add(role);
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  const key = `${reaction.message.id}-${reaction.emoji.name}`;
  const roleId = global.reactionRoles?.[key];
  if (roleId) {
    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.get(roleId);
    if (role) await member.roles.remove(role);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const settings = global.settings?.[message.guild?.id];
  if (settings?.countingChannel && message.channel.id === settings.countingChannel) {
    const num = parseInt(message.content);
    if (isNaN(num) || num !== settings.count + 1) {
      message.reply(`❌ Wrong number! The next number was **${settings.count + 1}**. Count reset to 0!`);
      global.settings[message.guild.id].count = 0;
    } else {
      global.settings[message.guild.id].count = num;
      message.react('✅');
    }
  }
});

client.login(TOKEN);
// Handle slash commands
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = commandMap.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(err);
      if (!interaction.replied) interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }

  // Handle button interactions
  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      const settings = global.settings?.[interaction.guild.id];
      if (!settings?.verifyRole) return interaction.reply({ content: '❌ Verification not set up!', ephemeral: true });
      const role = interaction.guild.roles.cache.get(settings.verifyRole);
      await interaction.member.roles.add(role);
      interaction.reply({ content: '✅ You have been verified!', ephemeral: true });
    }
    if (interaction.customId === 'close_ticket') {
      await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
      setTimeout(() => interaction.channel.delete(), 5000);
    }
  }
});

// Welcome and goodbye messages
client.on('guildMemberAdd', async (member) => {
  const settings = global.settings?.[member.guild.id];
  if (settings?.welcomeChannel) {
    const channel = member.guild.channels.cache.get(settings.welcomeChannel);
    if (channel) {
      const msg = settings.welcomeMessage.replace('{user}', `<@${member.user.id}>`);
      channel.send({ embeds: [new EmbedBuilder().setColor('Green').setTitle('👋 Welcome!').setDescription(msg).setThumbnail(member.user.displayAvatarURL())] });
    }
  }
  if (settings?.autorole) {
    const role = member.guild.roles.cache.get(settings.autorole);
    if (role) await member.roles.add(role);
  }
});

client.on('guildMemberRemove', async (member) => {
  const settings = global.settings?.[member.guild.id];
  if (settings?.goodbyeChannel) {
    const channel = member.guild.channels.cache.get(settings.goodbyeChannel);
    if (channel) {
      const msg = settings.goodbyeMessage.replace('{user}', member.user.username);
      channel.send({ embeds: [new EmbedBuilder().setColor('Red').setTitle('👋 Goodbye!').setDescription(msg)] });
    }
  }
});

// Reaction roles
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  const key = `${reaction.message.id}-${reaction.emoji.name}`;
  const roleId = global.reactionRoles?.[key];
  if (roleId) {
    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.get(roleId);
    if (role) await member.roles.add(role);
  }
});

client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  const key = `${reaction.message.id}-${reaction.emoji.name}`;
  const roleId = global.reactionRoles?.[key];
  if (roleId) {
    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    const role = guild.roles.cache.get(roleId);
    if (role) await member.roles.remove(role);
  }
});

// Counting channel
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const settings = global.settings?.[message.guild?.id];
  if (settings?.countingChannel && message.channel.id === settings.countingChannel) {
    const num = parseInt(message.content);
    if (isNaN(num) || num !== settings.count + 1) {
      message.reply(`❌ Wrong number! The next number was **${settings.count + 1}**. Count reset to 0!`);
      global.settings[message.guild.id].count = 0;
    } else {
      global.settings[message.guild.id].count = num;
      message.react('✅');
    }
  }
});

client.login(TOKEN);
