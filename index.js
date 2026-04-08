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
const seenNames = new Set();

// 1. LOAD COMMANDS & AUTO-SKIP DUPLICATES
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const imported = require(path.join(commandsPath, file));
    const commandList = Array.isArray(imported) ? imported : [imported];
    for (const cmd of commandList) {
      if (cmd && cmd.data) {
        if (seenNames.has(cmd.data.name)) {
          console.log(`⚠️ Skipping duplicate: ${cmd.data.name}`);
          continue;
        }
        seenNames.add(cmd.data.name);
        client.commands.set(cmd.data.name, cmd);
        allCommandsJson.push(cmd.data.toJSON());
      }
    }
  }
}

// 2. DEPLOY COMMANDS WITH ERROR DIAGNOSTICS
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
        console.error("❌ Failed to deploy commands.");
        if (error.rawError && error.rawError.errors) {
            console.dir(error.rawError.errors, { depth: null });
        } else {
            console.error(error);
        }
    }
});

// 3. IMPOSSIBLE-TO-BYPASS AUTOMOD
client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;
    const s = global.automodSettings[m.guild.id] || { filter: true, invites: true };

    // Clean accents (û -> u) and map symbols/numbers to letters
    const normalized = m.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const leetMap = { '4': 'a', '@': 'a', '3': 'e', '1': 'i', '!': 'i', '0': 'o', '5': 's', '$': 's', '7': 't' };
    const deLeeted = normalized.replace(/[4@31!05$7]/g, char => leetMap[char]);
    
    // Remove ALL non-alphabet characters (f.u.c.k or f u c k -> fuck)
    const finalCleaned = deLeeted.replace(/[^a-z]/g, "");

    if (s.invites && (m.content.includes('discord.gg/') || m.content.includes('http'))) {
        return m.delete().catch(() => null);
    }

    if (s.filter && badWordsList.length > 0) {
        const isBad = badWordsList.some(word => finalCleaned.includes(word.toLowerCase()));
        if (isBad) {
            try {
                await m.delete();
                const warn = await m.channel.send(`🚫 ${m.author}, you cannot bypass the filter!`);
                setTimeout(() => warn.delete().catch(() => null), 3000);
            } catch (err) {
                console.log("Hierarchy error.");
            }
        }
    }
});

// 4. INTERACTION HANDLER (TICKETS & COMMANDS)
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
      await ticketChannel.send({ content: `Hello ${user}, a staff member will assist you shortly.` });
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
