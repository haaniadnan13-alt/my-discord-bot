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
    console.error("⚠️ ERROR: Could not find badwords.js in the main folder!");
}

client.commands = new Collection();
const allCommandsJson = [];

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
                console.log("Hierarchy error: Bot role must be higher than the user.");
            }
        }
    }
});

client.on('interactionCreate', async (i) => {
  // 🎫 TICKET BUTTON LOGIC
  if (i.isButton() && i.customId === 'create_ticket_btn') {
    const { guild, user } = i;
    
    try {
      const ticketChannel = await guild.channels.create({
        name: `🎫-${user.username}`,
        type: ChannelType.GuildText,
        position: 0, // Top level
        permissionOverwrites: [
          {
            id: guild.id, // @everyone
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: user.id, // Creator
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks
            ],
          },
          {
            id: client.user.id, // Bot
            allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }
        ],
      });

      await ticketChannel.send({ content: `Hello, your support ticket has been created. Please explain your issue in detail. A staff member will assist you shortly.` });
      return i.reply({ content: `Ticket created: ${ticketChannel}`, ephemeral: true });
    } catch (err) {
      console.error(err);
      return i.reply({ content: "❌ Error creating ticket.", ephemeral: true });
    }
  }

  // SLASH COMMAND LOGIC
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) try { await cmd.execute(i); } catch (e) { console.error(e); }
});

client.login(TOKEN);
