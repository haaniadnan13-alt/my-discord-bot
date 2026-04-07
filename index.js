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
const CLIENT_ID = '1489497753523327047';

client.commands = new Collection();
const allCommandsJson = [];

// 📂 Load Commands
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

// 🌐 Register Global Commands
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('Pushing commands to Discord...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log('✅ Global commands registered!');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`✅ ${client.user.tag} is online!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (cmd) await cmd.execute(interaction);
});

// 🔊 Auto-VC Logic
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

client.login(TOKEN);
