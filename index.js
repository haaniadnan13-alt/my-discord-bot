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

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Set(); // To track duplicates

// 📂 Auto-Loader & Duplicate Checker
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const imported = require(path.join(commandsPath, file));
    const commands = Array.isArray(imported) ? imported : [imported];

    for (const cmd of commands) {
      if (cmd.data) {
        const name = cmd.data.name;
        
        // 🚨 This part finds the duplicates for you!
        if (seenNames.has(name)) {
          console.error(`❌ DUPLICATE FOUND: The command "/${name}" is repeated. Check your files!`);
          continue; 
        }
        
        seenNames.add(name);
        client.commands.set(name, cmd);
        allCommandsJson.push(cmd.data.toJSON());
      }
    }
  }
}

// 🌐 Register
const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log(`Attempting to register ${allCommandsJson.length} unique commands...`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log('✅ Global commands registered successfully!');
  } catch (error) {
    console.error('❌ Registration Failed:', error);
  }
})();

client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) await cmd.execute(i).catch(err => console.error(err));
});

client.login(TOKEN);
