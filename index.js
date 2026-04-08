require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [3276799],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';

global.automodSettings = {};

let badWordsList = [];
try {
    badWordsList = require('./badwords.js'); 
    console.log(`✅ Loaded ${badWordsList.length} words.`);
} catch (e) {
    console.error("⚠️ ERROR: Could not find badwords.js!");
}

client.commands = new Collection();
const allCommandsJson = [];

// 1. LOAD COMMANDS FROM FILES
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const imported = require(path.join(commandsPath, file));
    const commandList = Array.isArray(imported) ? imported : [imported];
    for (const cmd of commandList) {
      if (cmd && cmd.data) {
        client.commands.set(cmd.data.name, cmd);
        allCommandsJson.push(cmd.data.toJSON());
      }
    }
  }
}

// 2. DEPLOY COMMANDS TO DISCORD WHEN BOT STARTS
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log(`🔄 Refreshing ${allCommandsJson.length} slash commands...`);
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: allCommandsJson },
        );
        console.log('✅ Successfully reloaded slash commands!');
    } catch (error) {
        console.error("❌ Failed to deploy commands:", error);
    }
});

client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;
    const s = global.automodSettings[m.guild.id] || { filter: true, invites: true };
    const content = m.content.toLowerCase();
    if (s.invites && (content.includes('discord.gg/') || content.includes('http'))) {
        return m.delete().catch(() => null);
    }
    if (s.filter && badWordsList.length > 0) {
        if (badWordsList.some(word => content.includes(word.toLowerCase()))) {
            try {
                await m.delete();
                const warn = await m.channel.send(`🚫 ${m.author}, watch your language!`);
                setTimeout(() => warn.delete().catch(() => null), 3000);
            } catch (err) {
                console.log("Hierarchy error.");
            }
        }
    }
});

client.on('interactionCreate', async (i) => {
  if (i.isButton() && i.customId === 'create_ticket_btn') {
    const { guild, user } = i;
    try {
      const ticketChannel = await guild.channels.create({
        name: `🎫-${user.username}`,
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          {
            id: user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
          },
          {
            id: client.user.id,
            allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }
        ],
      });
      await ticketChannel.send({ content: `Hello ${user}, a staff member will be with you shortly.` });
      return i.reply({ content: `Ticket created: ${ticketChannel}`, ephemeral: true });
    } catch (err) {
      return i.reply({ content: "❌ Error creating ticket.", ephemeral: true });
    }
  }

  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) try { await cmd.execute(i); } catch (e) { console.error(e); }
});

client.login(TOKEN);
