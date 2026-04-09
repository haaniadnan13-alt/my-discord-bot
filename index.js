require('./keep_alive');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Partials, REST, Routes, Collection, PermissionFlagsBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1489497753523327047';
const MY_SERVER = '1491407568092790784'; 

client.commands = new Collection();
const allCommandsJson = [];

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
            const list = Array.isArray(imported) ? imported : [imported];
            for (const cmd of list) {
                if (cmd.data && cmd.execute) {
                    client.commands.set(cmd.data.name, cmd);
                    allCommandsJson.push(cmd.data.toJSON());
                }
            }
        }
    }
}
loadCommands(commandsPath);

client.on('interactionCreate', async i => {
    if (i.isButton()) {
        await i.deferReply({ ephemeral: true }); 

        if (i.customId.startsWith('verify_button_')) {
            const role = i.guild.roles.cache.get(i.customId.replace('verify_button_', ''));
            try {
                if (!role) return i.editReply("❌ Role missing.");
                await i.member.roles.add(role);
                return i.editReply("✅ Verified!");
            } catch (e) { return i.editReply("❌ Bot role too low."); }
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
            } catch (e) { return i.editReply("❌ Error."); }
        }
    }

    if (!i.isChatInputCommand()) return;

    if (i.commandName === 'createserver' && i.options.getString('template') === 'support' && i.guildId !== MY_SERVER) {
        return i.reply({ content: "❌ Private template.", ephemeral: true });
    }

    const cmd = client.commands.get(i.commandName);
    if (cmd) try { await cmd.execute(i); } catch (e) { console.error(e); }
});

client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        const guilds = await client.guilds.fetch();
        for (const [guildId] of guilds) {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), { body: [] });
        }
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: allCommandsJson });
        console.log(`✅ Duplicates wiped. Global list updated.`);
    } catch (e) { console.error(e); }
});

client.login(TOKEN);
