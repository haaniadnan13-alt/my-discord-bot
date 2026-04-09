require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, PermissionFlagsBits, ChannelType } = require('discord.js');

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
const MY_GUILD_ID = '1491407568092790784'; // Keep this for the private lock

client.commands = new Collection();
const allCommandsJson = [];

// 1. DYNAMIC LOADER
const commandsPath = path.join(__dirname, 'commands');
function loadCommands(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const imported = require(filePath);
            const commandList = Array.isArray(imported) ? imported : [imported];
            for (const cmd of commandList) {
                if (cmd.data && cmd.execute) {
                    client.commands.set(cmd.data.name, cmd);
                    allCommandsJson.push(cmd.data.toJSON());
                }
            }
        }
    }
}
loadCommands(commandsPath);

// 2. INTERACTION HANDLER
client.on('interactionCreate', async i => {
    if (i.isButton()) {
        await i.deferReply({ ephemeral: true });

        if (i.customId.startsWith('verify_button_')) {
            const roleId = i.customId.replace('verify_button_', '');
            const role = i.guild.roles.cache.get(roleId);
            if (!role) return i.editReply("❌ Role not found.");
            try {
                await i.member.roles.add(role);
                return i.editReply("✅ Verified!");
            } catch (e) {
                return i.editReply("❌ Bot role must be HIGHER than the target role.");
            }
        }

        if (i.customId === 'open_ticket') {
            try {
                const ch = await i.guild.channels.create({
                    name: `🎫-${i.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        { id: i.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: i.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                    ],
                });
                return i.editReply(`Ticket: ${ch}`);
            } catch (e) { return i.editReply("❌ Error creating ticket."); }
        }
    }

    if (!i.isChatInputCommand()) return;

    // PRIVATE LOCK: Only you can use the support template
    if (i.commandName === 'createserver' && i.options.getString('template') === 'support' && i.guildId !== MY_GUILD_ID) {
        return i.reply({ content: "❌ The 'support' template is private to the developer.", ephemeral: true });
    }

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

// 3. READY & GLOBAL SYNC
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        // DELETE local commands from every server to fix the double icons in your image
        const guilds = await client.guilds.fetch();
        for (const [guildId] of guilds) {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: [] });
        }

        // REGISTER everything as Global
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
        console.log(`✅ Duplicates cleared. All commands registered globally.`);
    } catch (e) { console.error(e); }
});

client.login(TOKEN);
