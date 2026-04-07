require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, EmbedBuilder, Collection } = require('discord.js');

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
client.commands = new Collection();
const allCommandsJson = [];

// Better Command Handler: Reads all files in the /commands folder
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const imported = require(filePath);
    
    // Handles both single objects and arrays of commands
    const commands = Array.isArray(imported) ? imported : [imported];
    
    for (const cmd of commands) {
      if (cmd.data && cmd.execute) {
        client.commands.set(cmd.data.name, cmd);
        allCommandsJson.push(cmd.data.toJSON());
      }
    }
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: allCommandsJson });
    console.log(`✅ Registered ${allCommandsJson.length} slash commands!`);
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(err);
      if (!interaction.replied) interaction.reply({ content: '❌ An error occurred!', ephemeral: true });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      const settings = global.settings?.[interaction.guild.id];
      if (!settings?.verifyRole) return interaction.reply({ content: '❌ Verification not set up!', ephemeral: true });
      const role = interaction.guild.roles.cache.get(settings.verifyRole);
      if (role) await interaction.member.roles.add(role);
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
      const msg = settings.welcomeMessage?.replace('{user}', `<@${member.user.id}>`) || `Welcome ${member.user}!`;
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
      const msg = settings.goodbyeMessage?.replace('{user}', member.user.username) || `${member.user.username} left.`;
      channel.send({ embeds: [new EmbedBuilder().setColor('Red').setTitle('👋 Goodbye!').setDescription(msg)] });
    }
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  const key = `${reaction.message.id}-${reaction.emoji.name}`;
  const roleId = global.reactionRoles?.[key];
  if (roleId) {
    const member = await reaction.message.guild.members.fetch(user.id);
    const role = reaction.message.guild.roles.cache.get(roleId);
    if (role) await member.roles.add(role);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  const settings = global.settings?.[message.guild.id];
  if (settings?.countingChannel && message.channel.id === settings.countingChannel) {
    const num = parseInt(message.content);
    if (isNaN(num) || num !== (settings.count || 0) + 1) {
      message.reply(`❌ Wrong number! The next number was **${(settings.count || 0) + 1}**. Count reset!`);
      global.settings[message.guild.id].count = 0;
    } else {
      global.settings[message.guild.id].count = num;
      message.react('✅');
    }
  }
});

client.login(TOKEN);
