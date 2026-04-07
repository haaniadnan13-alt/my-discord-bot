require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, ChannelType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
client.commands = new Collection();
const allCommandsJson = [];

global.settings = {};
global.automodSettings = {};

// 📂 Command Handler
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
      // NEW: Link message logic from command files to the client
      if (cmd.name === 'messageCreate') {
        client.on('messageCreate', (message) => cmd.execute(message));
      }
    }
  }
}

client.once('ready', async () => {
  console.log(`✅ ${client.user.tag} is online!`);
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: allCommandsJson });
    console.log(`✅ Registered ${allCommandsJson.length} commands.`);
  } catch (error) {
    console.error(error);
  }
});

// 📩 Message Logic (Counting System)
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const s = global.settings[message.guild.id];
  if (s?.countingChannel === message.channel.id) {
    const num = parseInt(message.content);
    const nextNum = (s.count || 0) + 1;
    if (isNaN(num) || num !== nextNum) {
      message.reply(`❌ Wrong number! Resetting to 0.`);
      global.settings[message.guild.id].count = 0;
    } else {
      global.settings[message.guild.id].count = num;
      message.react('✅');
    }
  }
});

// 👋 Join Logic (Welcome + Auto-role)
client.on('guildMemberAdd', async (member) => {
  const s = global.settings[member.guild.id];
  if (s?.welcomeChannel) {
    const chan = member.guild.channels.cache.get(s.welcomeChannel);
    if (chan) chan.send(`👋 Welcome ${member.user} to the server!`);
  }
  
  if (s?.autorole) {
    const role = member.guild.roles.cache.get(s.autorole);
    if (role) await member.roles.add(role).catch(() => null);
  }
});

// 🎤 Auto-VC
client.on('voiceStateUpdate', async (oldState, newState) => {
    const { guild, member } = newState;
    if (newState.channel?.name.includes('➕┃CREATE-NEW-VC')) {
        const tempChannel = await guild.channels.create({
            name: `🔊┃${member.user.username}'s Room`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parent,
            permissionOverwrites: [
                { id: member.id, allow: ['Connect', 'ManageChannels', 'MoveMembers'] },
                { id: guild.id, allow: ['Connect'] }
            ]
        });
        await member.voice.setChannel(tempChannel);
    }
    if (oldState.channel?.name.includes('🔊┃') && oldState.channel.members.size === 0) {
        await oldState.channel.delete().catch(() => null);
    }
});

// 🖱️ Interaction Handler
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd) await cmd.execute(interaction);
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'open_ticket') {
      const ticketChan = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: ['ViewChannel'] },
          { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
        ]
      });
      interaction.reply({ content: `✅ Ticket created: ${ticketChan}`, ephemeral: true });
    }
  }
});

client.login(TOKEN);
