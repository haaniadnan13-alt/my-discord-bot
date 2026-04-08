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
const OWNER_ID = '1316341477114122305'; 

// 🛡️ Global Settings Initialization
global.automodSettings = {};

// 🤬 Load the Cleaned Bad Words List
let badWordsList = [];
try {
    badWordsList = require('./badwords.js');
    console.log(`✅ Loaded ${badWordsList.length} respectful bad words.`);
} catch (e) {
    console.error("⚠️ Could not load badwords.js! Ensure you added module.exports.");
}

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Set();

// 📂 Command Loader
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
    } catch (err) { console.error(`❌ Loader Error [${file}]:`, err.message); }
  }
}

// 🚀 Register Slash Commands
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log('✅ Commands Synced');
  } catch (e) { console.error('❌ Register Error:', e.message); }
})();

// 🎮 Interaction Handler + DM Bug Tracker
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) {
    try {
      await cmd.execute(i);
    } catch (err) {
      console.error(err);
      // 🕵️ Bug DM - Sends the error directly to you so you don't need testers
      try {
          const owner = await client.users.fetch(OWNER_ID);
          const bugEmbed = new EmbedBuilder()
              .setTitle('🚨 Bug Detected')
              .setColor('#FF0000')
              .addFields(
                  { name: 'Command', value: `/${i.commandName}`, inline: true },
                  { name: 'Server', value: `${i.guild?.name || 'DMs'}`, inline: true },
                  { name: 'Error Log', value: `\`\`\`js\n${err.message}\n\`\`\`` }
              )
              .setTimestamp();
          await owner.send({ embeds: [bugEmbed] });
      } catch (e) { console.error("Could not send Bug DM."); }

      if (!i.replied && !i.deferred) await i.reply({ content: 'Internal Error.', ephemeral: true });
    }
  }
});

// 🛡️ THE AUTOMOD ENGINE
client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;

    // Default to filter: true so it works even without setup
    const s = global.automodSettings[m.guild.id] || { filter: true, invites: true };
    const content = m.content.toLowerCase();

    // 🔗 Invite Filter
    if (s.invites && (content.includes('discord.gg/') || content.includes('http'))) {
        await m.delete().catch(() => null);
        return m.channel.send(`⚠️ ${m.author}, links are blocked!`).then(msg => setTimeout(() => msg.delete(), 3000));
    }

    // 🤬 Bad Word Filter (Matches your toggle /automod filter:true)
    if (s.filter && Array.isArray(badWordsList)) {
        if (badWordsList.some(word => content.includes(word.toLowerCase()))) {
            await m.delete().catch(() => null);
            return m.channel.send(`🚫 ${m.author}, watch your language!`).then(msg => setTimeout(() => msg.delete(), 3000));
        }
    }
});

// 🛡️ ANTI-CRASH (Keeps the bot alive even if things break)
process.on('unhandledRejection', e => console.error('Silent Rejection:', e));
process.on('uncaughtException', e => console.error('Critical Crash:', e));

client.login(TOKEN);
