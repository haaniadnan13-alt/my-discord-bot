require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [3276799], // All intents
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';
const OWNER_ID = '1316341477114122305'; // Your ID for Bug DMs

// 🛡️ Automod Settings
global.automodSettings = {};

// 🤬 Bad Words Loader
let badWordsList = [];
try {
    badWordsList = require('./badwords.js');
} catch (e) {
    console.error("⚠️ Could not load badwords.js!");
}

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Set();

// 📂 Loader
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const imported = require(path.join(commandsPath, file));
      const commandList = Array.isArray(imported) ? imported : [imported];
      for (const cmd of commandList) {
        if (cmd && cmd.data) {
          const name = cmd.data.name;
          if (seenNames.has(name) || name !== name.toLowerCase()) continue;
          seenNames.add(name);
          client.commands.set(name, cmd);
          allCommandsJson.push(cmd.data.toJSON());
        }
      }
    } catch (err) { console.error(`Error loading ${file}`); }
  }
}

// 🚀 Interaction Handler with Bug DM Fix
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) {
    try {
      await cmd.execute(i);
    } catch (err) {
      console.error(err);
      // 🕵️ Bug Tracker
      try {
          const owner = await client.users.fetch(OWNER_ID);
          const bugEmbed = new EmbedBuilder()
              .setTitle('🚨 Command Failed')
              .setColor('Red')
              .addFields(
                  { name: 'Command', value: `/${i.commandName}` },
                  { name: 'Error', value: `\`\`\`js\n${err.message}\n\`\`\`` }
              );
          await owner.send({ embeds: [bugEmbed] });
      } catch (e) { console.error("DM failed"); }
      if (!i.replied && !i.deferred) await i.reply({ content: 'Internal Error.', ephemeral: true });
    }
  }
});

// 🛡️ THE AUTOMOD ENGINE
client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;

    // Fix: Default to ON if setting hasn't been touched yet
    const settings = global.automodSettings[m.guild.id] || { filter: true, invites: true };
    const content = m.content.toLowerCase();

    // Link Filter
    if (settings.invites && (content.includes('discord.gg/') || content.includes('http'))) {
        await m.delete().catch(() => null);
        return m.channel.send(`⚠️ ${m.author}, no links!`).then(msg => setTimeout(() => msg.delete(), 3000));
    }

    // Word Filter - This is what failed in your screenshot
    if (settings.filter && Array.isArray(badWordsList)) {
        if (badWordsList.some(word => content.includes(word.toLowerCase()))) {
            await m.delete().catch(() => null);
            return m.channel.send(`🚫 ${m.author}, watch your language!`).then(msg => setTimeout(() => msg.delete(), 3000));
        }
    }
});

// 🛡️ Anti-Crash
process.on('unhandledRejection', e => console.error('Rejection:', e));
process.on('uncaughtException', e => console.error('Exception:', e));

client.login(TOKEN);
