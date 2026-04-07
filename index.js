require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection } = require('discord.js');

const client = new Client({
  intents: [3276799],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';

// 🛡️ CRITICAL: This line prevents the "Internal Error"
global.automodSettings = {}; 

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Set();

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const imported = require(path.join(commandsPath, file));
      const commandList = Array.isArray(imported) ? imported : [imported];

      for (const cmd of commandList) {
        if (cmd && cmd.data) {
          const commandData = cmd.data.toJSON();
          const name = commandData.name;

          if (seenNames.has(name)) continue;

          seenNames.add(name);
          client.commands.set(name, cmd);
          allCommandsJson.push(commandData);
        }
      }
    } catch (error) {
      console.error(`❌ Error in ${file}:`, error.message);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log(`✅ Registered ${allCommandsJson.length} commands.`);
  } catch (error) {
    console.error('❌ Push failed:', error.message);
  }
})();

client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) {
    try {
      await cmd.execute(i);
    } catch (err) {
      console.error(err);
      if (!i.replied && !i.deferred) await i.reply({ content: 'Command Error.', ephemeral: true });
    }
  }
});

// 🛡️ This handles the actual link blocking
client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;
    const settings = global.automodSettings[m.guild.id] || {};
    if (settings.invites && (m.content.includes('discord.gg/') || m.content.includes('discord.com/invite/'))) {
        await m.delete().catch(() => null);
        m.channel.send(`🚫 ${m.author}, invites are not allowed!`).then(msg => setTimeout(() => msg.delete(), 5000));
    }
});

client.login(TOKEN);
