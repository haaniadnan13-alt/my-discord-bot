require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';
const GUILD_ID = '1491407568092790784'; 

client.commands = new Collection();
const allCommandsJson = [];

// 1. LOAD COMMANDS
const commandsPath = path.join(__dirname, 'commands');
function loadCommands(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const cmd = require(filePath);
            if (cmd.data && cmd.execute) {
                client.commands.set(cmd.data.name, cmd);
                allCommandsJson.push(cmd.data.toJSON());
            }
        }
    }
}
loadCommands(commandsPath);

// 2. INTERACTION HANDLER (Fixed Interaction Failed)
client.on('interactionCreate', async i => {
    if (i.isButton()) {
        if (i.customId.startsWith('verify_button_')) {
            const roleId = i.customId.replace('verify_button_', '');
            const role = i.guild.roles.cache.get(roleId);
            
            // Critical Fix: Tell Discord we are working so it doesn't time out
            await i.deferReply({ ephemeral: true }); 

            if (!role) return i.editReply({ content: "❌ Error: Role not found. Check the ID." });

            try {
                await i.member.roles.add(role);
                return i.editReply({ content: "✅ You have been verified!" });
            } catch (e) {
                console.error(e);
                return i.editReply({ content: "❌ Bot role must be ABOVE the target role in settings." });
            }
        }

        if (i.customId === 'open_ticket') {
            await i.deferReply({ ephemeral: true });
            try {
                const channel = await i.guild.channels.create({
                    name: `🎫-${i.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        { id: i.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: i.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                    ],
                });
                return i.editReply({ content: `Ticket created: ${channel}` });
            } catch (e) { 
                return i.editReply({ content: "❌ Error creating ticket." }); 
            }
        }
    }

    if (!i.isChatInputCommand()) return;
    const cmd = client.commands.get(i.commandName);
    if (cmd) {
        try { 
            await cmd.execute(i); 
        } catch (e) { 
            console.error(e);
            if (!i.replied && !i.deferred) await i.reply({ content: 'Error.', ephemeral: true });
        }
    }
});

// 3. DEPLOY & CLEANUP (Fixes 2 Commands)
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        // Clear old Guild commands that cause duplicates
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
        
        // Register Global commands
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
        
        console.log('✅ Duplicates cleared. Commands synced globally.');
    } catch (e) {
        console.error('Registration Error:', e);
    }
});

client.login(TOKEN);
