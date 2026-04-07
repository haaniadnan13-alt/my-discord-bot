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

// 🛡️ CRITICAL: Prevents "Internal Error" and sets default Automod to ON
global.automodSettings = {
    default: { active: true, invites: true, spam: true }
};

// 🤬 Load your 500+ Bad Words
let badWordsList = [];
try {
    badWordsList = require('./badwords.js');
} catch (e) {
    console.error("⚠️ Could not load badwords.js. Make sure it exists!");
}

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Set();

// 📂 Deep-Scan Command Loader
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

          // Skip duplicates and invalid names
          if (seenNames.has(name) || name !== name.toLowerCase()) continue;

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

// 🚀 Register all 151+ commands to Discord
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log(`Pushing ${allCommandsJson.length} commands to Discord...`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log('✅ Commands Registered Successfully!');
  } catch (error) {
    console.error('❌ Discord rejected the push:', error.message);
  }
})();

// 🎮 Command Interaction Handler
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) {
    try {
      await cmd.execute(i);
    } catch (err) {
      console.error(err);
      if (!i.replied && !i.deferred) await i.reply({ content: 'Internal Error.', ephemeral: true });
    }
  }
});

// 🛡️ THE AUTOMOD ENGINE (Links & Cussing)
client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;

    const settings = global.automodSettings[m.guild.id] || global.automodSettings.default;
    if (!settings.active) return;

    const content = m.content.toLowerCase();

    // 🔗 Link/Invite Filter
    if (settings.invites && (content.includes('discord.gg/') || content.includes('discord.com/invite/') || content.includes('http'))) {
        await m.delete().catch(() => null);
        return m.channel.send(`⚠️ ${m.author}, links are not allowed here!`)
            .then(msg => setTimeout(() => msg.delete(), 3000));
    }

    // 🤬 500+ Bad Word Filter
    if (Array.isArray(badWordsList) && badWordsList.some(word => content.includes(word.toLowerCase()))) {
        await m.delete().catch(() => null);
        return m.channel.send(`🚫 ${m.author}, watch your language!`)
            .then(msg => setTimeout(() => msg.delete(), 3000));
    }
});

client.login(TOKEN);
