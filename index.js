require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, PermissionFlagsBits, ChannelType } = require('discord.js');

// 1. SETUP CLIENT WITH ALL NECESSARY INTENTS
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // Required for Welcome/Bye/Auto-role
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Map(); // Using Map to track paths

// 2. LOAD COMMANDS & DETECT DUPLICATE FILE PATHS
const commandsPath = path.join(__dirname, 'commands');

function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadCommands(filePath); // Search in subfolders
        } else if (file.endsWith('.js')) {
            const imported = require(filePath);
            const commandList = Array.isArray(imported) ? imported : [imported];

            for (const cmd of commandList) {
                if (cmd && cmd.data) {
                    if (seenNames.has(cmd.data.name)) {
                        // LOGS THE EXACT PATH SO YOU CAN DELETE THE BAD ONE
                        console.log(`⚠️ DUPLICATE FOUND: "/${cmd.data.name}" at ${filePath}`);
                        console.log(`💡 Keeping version from: ${seenNames.get(cmd.data.name)}`);
                        continue;
                    }
                    seenNames.set(cmd.data.name, filePath);
                    client.commands.set(cmd.data.name, cmd);
                    allCommandsJson.push(cmd.data.toJSON());
                }
            }
        }
    }
}

if (fs.existsSync(commandsPath)) {
    loadCommands(commandsPath);
}

// 3. AUTOMOD & BADWORDS LOGIC
let badWordsList = [];
try {
    badWordsList = require('./badwords.js'); 
    console.log(`✅ Loaded ${badWordsList.length} words.`);
} catch (e) {
    console.error("⚠️ ERROR: Could not find badwords.js!");
}

global.automodSettings = {};

client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;
    const s = global.automodSettings[m.guild.id] || { filter: true, invites: true };

    const normalized = m.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const leetMap = { '4': 'a', '@': 'a', '3': 'e', '1': 'i', '!': 'i', '0': 'o', '5': 's', '$': 's', '7': 't' };
    const deLeeted = normalized.replace(/[4@31!05$7]/g, char => leetMap[char]);
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
            } catch (err) { console.log("Hierarchy error."); }
        }
    }
});

// 4. WELCOME, BYE, AND AUTO-ROLE (Works for everyone)
client.on('guildMemberAdd', async (member) => {
    const welcomeChannel = member.guild.channels.cache.find(ch => ch.name.includes('welcome'));
    const role = member.guild.roles.cache.find(r => r.name === 'MEMBER');

    if (welcomeChannel) {
        welcomeChannel.send(`👋 **Welcome to the Forge, ${member}!** Glad to have you here.`);
    }
    
    if (role) {
        await member.roles.add(role).catch(() => {});
    }
});

client.on('guildMemberRemove', (member) => {
    const byeChannel = member.guild.channels.cache.find(ch => ch.name.includes('bye'));
    if (byeChannel) {
        byeChannel.send(`📤 **${member.user.tag} has left the sector.**`);
    }
});

// 5. DEPLOY AND READY
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        console.log(`🔄 Refreshing ${allCommandsJson.length} slash commands...`);
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
        console.log('✅ Successfully reloaded slash commands!');
    } catch (error) { console.error(error); }
});

// 6. INTERACTION HANDLER (Commands & Tickets)
client.on('interactionCreate', async (i) => {
    if (i.isButton() && i.customId === 'create_ticket_btn') {
        const { guild, user } = i;
        try {
            const ticketChannel = await guild.channels.create({
                name: `🎫-${user.username}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                    { id: client.user.id, allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                ],
            });
            await ticketChannel.send({ content: `Hello ${user}, a staff member will assist you shortly.` });
            return i.reply({ content: `Ticket created: ${ticketChannel}`, ephemeral: true });
        } catch (err) { return i.reply({ content: "❌ Error creating ticket.", ephemeral: true }); }
    }

    if (!i.isChatInputCommand()) return;
    const cmd = client.commands.get(i.commandName);
    if (cmd) try { await cmd.execute(i); } catch (e) { console.error(e); }
});

client.login(TOKEN);
