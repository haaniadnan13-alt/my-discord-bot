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
    GatewayIntentBits.GuildVoiceStates // Added for Voice logging
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';

client.commands = new Collection();
const allCommandsJson = [];
const seenNames = new Map();

// 1. LOAD COMMANDS & DUPLICATE PROTECTION
const commandsPath = path.join(__dirname, 'commands');

function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const imported = require(filePath);
            const commandList = Array.isArray(imported) ? imported : [imported];

            for (const cmd of commandList) {
                if (cmd && cmd.data) {
                    if (seenNames.has(cmd.data.name)) {
                        console.log(`⚠️ DUPLICATE FOUND: "/${cmd.data.name}" at ${filePath}`);
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

if (fs.existsSync(commandsPath)) loadCommands(commandsPath);

// 2. AUTOMOD LOGIC
let badWordsList = [];
try { badWordsList = require('./badwords.js'); } catch (e) { console.error("⚠️ No badwords.js found!"); }
global.automodSettings = {};

client.on('messageCreate', async (m) => {
    if (!m.guild || m.author.bot) return;
    const s = global.automodSettings[m.guild.id] || { filter: true, invites: true };

    if (s.invites && (m.content.includes('discord.gg/') || m.content.includes('http'))) {
        return m.delete().catch(() => null);
    }

    if (s.filter && badWordsList.length > 0) {
        const clean = m.content.toLowerCase().replace(/[^a-z]/g, "");
        if (badWordsList.some(w => clean.includes(w.toLowerCase()))) {
            await m.delete().catch(() => null);
        }
    }
});

// 3. MEMBER EVENTS (WELCOME/BYE)
client.on('guildMemberAdd', async (member) => {
    const welcome = member.guild.channels.cache.find(ch => ch.name.includes('welcome'));
    if (welcome) welcome.send(`👋 **Welcome, ${member}!**`);
});

client.on('guildMemberRemove', (member) => {
    const bye = member.guild.channels.cache.find(ch => ch.name.includes('bye'));
    if (bye) bye.send(`📤 **${member.user.tag} has left.**`);
});

// 4. INTERACTION HANDLER (Buttons & Commands)
client.on('interactionCreate', async (i) => {
    // --- BUTTON HANDLER ---
    if (i.isButton()) {
        // Verification Button Logic
        if (i.customId.startsWith('verify_button_')) {
            const roleId = i.customId.replace('verify_button_', '');
            const role = i.guild.roles.cache.get(roleId);
            const logChannel = i.guild.channels.cache.find(c => c.name.includes('log'));

            if (!role) return i.reply({ content: "❌ Role no longer exists.", ephemeral: true });

            try {
                await i.member.roles.add(role);
                await i.reply({ content: `✅ Verified! You received **${role.name}**.`, ephemeral: true });

                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('🛡️ Member Verified')
                        .setDescription(`${i.user} has verified and received ${role}.`)
                        .setColor('#43b581')
                        .setTimestamp();
                    logChannel.send({ embeds: [logEmbed] });
                }
            } catch (err) {
                return i.reply({ content: "❌ I cannot assign that role. Check my permissions!", ephemeral: true });
            }
        }

        // Ticket Button Logic
        if (i.customId === 'open_ticket') {
            const logChannel = i.guild.channels.cache.find(c => c.name.includes('log'));
            try {
                const channel = await i.guild.channels.create({
                    name: `🎫-${i.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        { id: i.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: i.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                    ],
                });
                
                if (logChannel) logChannel.send(`🎫 **Ticket Opened:** ${i.user.tag} created ${channel}`);
                return i.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
            } catch (e) { return i.reply({ content: "❌ Error.", ephemeral: true }); }
        }
    }

    // --- SLASH COMMAND HANDLER ---
    if (!i.isChatInputCommand()) return;
    const cmd = client.commands.get(i.commandName);
    if (cmd) try { await cmd.execute(i); } catch (e) { console.error(e); }
});

// 5. DEPLOY
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
        console.log('✅ Commands Synced!');
    } catch (error) { console.error(error); }
});

client.login(TOKEN);
