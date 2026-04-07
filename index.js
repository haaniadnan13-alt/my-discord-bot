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

// 📂 Command Handler: Reads all .js files inside the /commands folder
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const imported = require(filePath);
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
      if (!interaction.replied) interaction.reply({ content: '❌ Error executing command!', ephemeral: true });
    }
  }

  // Verification & Ticket Buttons
  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      const roleId = global.settings?.[interaction.guildId]?.verifyRole;
      if (!roleId) return interaction.reply({ content: '❌ Verification not set up!', ephemeral: true });
      const role = interaction.guild.roles.cache.get(roleId);
      if (role) await interaction.member.roles.add(role);
      interaction.reply({ content: '✅ Verified!', ephemeral: true });
    }
    if (interaction.customId === 'open_ticket') {
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0, // GuildText
            permissionOverwrites: [
                { id: interaction.guild.id, deny: ['ViewChannel'] },
                { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
            ]
        });
        interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
    }
  }
});

// Automod & Counting Logic
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  // 🛡️ Run Automod Engine
  const automod = client.commands.get('automod');
  if (automod && automod.handle) {
    await automod.handle(message);
  }

  // 🔢 Counting Channel logic
  const settings = global.settings?.[message.guild.id];
  if (settings?.countingChannel && message.channel.id === settings.countingChannel) {
    const num = parseInt(message.content);
    const expected = (settings.count || 0) + 1;
    if (isNaN(num) || num !== expected) {
      message.reply(`❌ Wrong number! Resetting to 0.`);
      global.settings[message.guild.id].count = 0;
    } else {
      global.settings[message.guild.id].count = num;
      message.react('✅');
    }
  }
});

// Join/Leave Handlers
client.on('guildMemberAdd', async (member) => {
  const s = global.settings?.[member.guild.id];
  if (s?.welcomeChannel) {
    const chan = member.guild.channels.cache.get(s.welcomeChannel);
    if (chan) chan.send(`👋 Welcome ${member.user}!`);
  }
  if (s?.autorole) {
    const role = member.guild.roles.cache.get(s.autorole);
    if (role) await member.roles.add(role).catch(() => null);
  }
});

client.login(TOKEN);
