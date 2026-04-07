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
const seenNames = new Set(); // 🛡️ Anti-Duplicate Shield

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const imported = require(path.join(commandsPath, file));
      const commandList = Array.isArray(imported) ? imported : [imported];

      for (const cmd of commandList) {
        if (cmd && (cmd.data || cmd.name)) {
          const commandData = cmd.data ? cmd.data.toJSON() : cmd;
          const name = commandData.name;
          const desc = commandData.description;

          // 🔍 Validation
          if (!name || name !== name.toLowerCase() || name.includes(' ')) continue;
          if (!desc) continue;
          
          // 🚫 Skip if we've already added a command with this name
          if (seenNames.has(name)) {
            console.log(`⚠️ Skipping duplicate: ${name} in ${file}`);
            continue;
          }

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
    console.log(`Pushing ${allCommandsJson.length} unique commands...`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log('✅ SUCCESS: Commands are now live globally!');
  } catch (error) {
    console.error('❌ Discord rejected the push:', error.message);
  }
})();

client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.commands.get(i.commandName);
  if (cmd) {
    try {
      await cmd.execute(i);
    } catch (err) {
      console.error(`Error executing ${i.commandName}:`, err);
      if (!i.replied && !i.deferred) await i.reply({ content: 'Internal Error.', ephemeral: true });
    }
  }
});

client.login(TOKEN);
