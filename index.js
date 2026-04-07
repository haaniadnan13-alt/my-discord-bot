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

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const imported = require(path.join(commandsPath, file));
      
      // 🚀 THIS IS THE FIX: It checks if your file has 1 command or a list of 100
      const commandList = Array.isArray(imported) ? imported : [imported];

      for (const cmd of commandList) {
        if (cmd && (cmd.data || cmd.name)) {
          const commandData = cmd.data ? cmd.data.toJSON() : cmd;
          const commandName = cmd.data ? cmd.data.name : cmd.name;

          client.commands.set(commandName, cmd);
          allCommandsJson.push(commandData);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to load file ${file}:`, error);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log(`Searching... Found ${allCommandsJson.length} commands total.`);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
    console.log('✅ All commands pushed to Discord!');
  } catch (error) {
    console.error('❌ Registration Error:', error);
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
      if (!i.replied) await i.reply({ content: 'Command error!', ephemeral: true });
    }
  }
});

client.login(TOKEN);
