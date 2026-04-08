require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [3276799],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';

global.automodSettings = {};

// 🤬 Fix: Path logic to find your word list
let badWordsList = [];
try {
    // This looks for the .js file you uploaded
    badWordsList = require('./badwords.js'); 
    console.log(`✅ Loaded ${badWordsList.length} words.`);
} catch (e) {
    console.error("⚠️ ERROR: Could not find badwords.js in the main folder!");
}

client.commands = new Collection();
const allCommandsJson = [];

// Loader for commands
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

// 🛡️ THE ENGINE (Simplified & Aggressive)
client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;

    const s = global.automodSettings[m.guild.id] || { filter: true, invites: true };
    const content = m.content.toLowerCase();

    // 1. Link Filter
    if (s.invites && (content.includes('discord.gg/') || content.includes('http'))) {
        return m.delete().catch(() => null);
    }

    // 2. Word Filter
    if (s.filter && badWordsList.length > 0) {
        // We use a regex test to catch the word even if it's "f.u.c.k" or surrounded by symbols
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
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) try { await cmd.execute(i); } catch (e) { console.error(e); }
});

client.login(TOKEN);
