// ==============================
// Mega Discord Server Setup Bot
// Part 1
// ==============================

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Permission shortcuts
const R = PermissionsBitField.Flags;

// ------------------------------
// CONFIG - BOT TOKEN
// ------------------------------
const TOKEN = "MTQ4OTQ5Nzc1MzUyMzMyNzA0Nw.GdmSPR.5Jy4Iiq7qLn8lPgYaLngtsxJ4BmaBMTQ4OTQ5Nzc1MzUyMzMyNzA0Nw.GdmSPR.5Jy4Iiq7qLn8lPgYaLngtsxJ4BmaB6O3-42Kp06O3-42Kp0";

// ------------------------------
// SERVER STRUCTURE DATA
// ------------------------------

const roles = [
  // Staff Roles
  { name: "👑 Owner", perms: [R.Administrator] },
  { name: "🛡️ Co-Owner", perms: [R.Administrator] },
  { name: "🔧 Server Manager", perms: [R.ManageChannels, R.ManageRoles, R.KickMembers] },
  { name: "⚙️ Admin", perms: [R.ManageChannels, R.KickMembers, R.BanMembers] },
  { name: "🧪 Moderator", perms: [R.KickMembers, R.ManageMessages] },
  { name: "🧹 Helper", perms: [R.ManageMessages] },
  { name: "🎫 Support Team", perms: [R.SendMessages, R.ViewChannel] },
  { name: "📢 Event Manager", perms: [R.ManageChannels, R.ManageMessages] },
  { name: "🎥 Content Manager", perms: [R.ManageChannels, R.ManageMessages] },

  // Member Roles
  { name: "👤 Member", perms: [R.ViewChannel, R.SendMessages] },

  // Content Creator Role
  { name: "🎬 Content Creator", perms: [R.SendMessages, R.AttachFiles] },
];

// Example: Rocket League ranks
const rlRanks = [
  { name: "Bronze I", emoji: "🥉" },
  { name: "Bronze II", emoji: "🥉" },
  { name: "Bronze III", emoji: "🥉" },
  { name: "Silver I", emoji: "🥈" },
  { name: "Silver II", emoji: "🥈" },
  { name: "Silver III", emoji: "🥈" },
  { name: "Gold I", emoji: "🥇" },
  { name: "Gold II", emoji: "🥇" },
  { name: "Gold III", emoji: "🥇" },
  { name: "Platinum I", emoji: "✨" },
  { name: "Platinum II", emoji: "✨" },
  { name: "Platinum III", emoji: "✨" },
  { name: "Diamond I", emoji: "💎" },
  { name: "Diamond II", emoji: "💎" },
  { name: "Diamond III", emoji: "💎" },
  { name: "Champion I", emoji: "🏆" },
  { name: "Champion II", emoji: "🏆" },
  { name: "Champion III", emoji: "🏆" },
  { name: "SSL", emoji: "🚀" },
];

// Example categories
const categories = [
  { name: "💬 Community", desc: "Chat with other members", perms: [R.ViewChannel] },
  { name: "🎮 Rocket League", desc: "Game-specific channels", perms: [R.ViewChannel] },
  { name: "📢 Announcements", desc: "Staff-only announcements", perms: [R.ViewChannel] },
  { name: "🎥 Creators", desc: "Content creators post here", perms: [R.ViewChannel] },
  { name: "🛠️ Staff", desc: "Staff-only channels", perms: [R.ViewChannel] },
  { name: "📊 Logs", desc: "Hidden logs from members", perms: [R.ViewChannel] },
  { name: "🔊 Voice Channels", desc: "Join voice chats", perms: [R.ViewChannel] },
];

// Text channels
const textChannels = [
  { name: "rules", category: "💬 Community", desc: "Read-only server rules", perms: [R.ViewChannel] },
  { name: "general", category: "💬 Community", desc: "Chat with everyone", perms: [R.ViewChannel, R.SendMessages] },
  { name: "announcements", category: "📢 Announcements", desc: "Official announcements", perms: [R.ViewChannel] },
  { name: "creator-uploads", category: "🎥 Creators", desc: "Content creator uploads", perms: [R.ViewChannel, R.SendMessages] },
  { name: "event-chat", category: "🎮 Rocket League", desc: "Event discussions", perms: [R.ViewChannel, R.SendMessages] },
];
// ==============================
// Part 2 - Extended Roles, Game Ranks, Voice Channels
// ==============================

// COD Ranks
const codRanks = [
  { name: "Recruit", emoji: "🥉" },
  { name: "Soldier I", emoji: "🥉" },
  { name: "Soldier II", emoji: "🥉" },
  { name: "Veteran I", emoji: "🥈" },
  { name: "Veteran II", emoji: "🥈" },
  { name: "Elite", emoji: "🥇" },
  { name: "Champion", emoji: "✨" },
  { name: "Top 500", emoji: "💎" },
];

// Fortnite Ranks
const fortniteRanks = [
  { name: "Bronze I", emoji: "🥉" },
  { name: "Bronze II", emoji: "🥉" },
  { name: "Bronze III", emoji: "🥉" },
  { name: "Silver I", emoji: "🥈" },
  { name: "Silver II", emoji: "🥈" },
  { name: "Silver III", emoji: "🥈" },
  { name: "Gold I", emoji: "🥇" },
  { name: "Gold II", emoji: "🥇" },
  { name: "Gold III", emoji: "🥇" },
  { name: "Platinum I", emoji: "✨" },
  { name: "Platinum II", emoji: "✨" },
  { name: "Platinum III", emoji: "✨" },
  { name: "Diamond", emoji: "💎" },
  { name: "Elite", emoji: "🏆" },
  { name: "Champion", emoji: "🚀" },
  { name: "Unreal", emoji: "🚀" },
];

// Apex Legends Ranks
const apexRanks = [
  { name: "Rookie", emoji: "🥉" },
  { name: "Bronze", emoji: "🥉" },
  { name: "Silver", emoji: "🥈" },
  { name: "Gold", emoji: "🥇" },
  { name: "Platinum", emoji: "✨" },
  { name: "Diamond", emoji: "💎" },
  { name: "Master", emoji: "🏆" },
  { name: "Predator", emoji: "🚀" },
];

// Minecraft Extended Roles
const mcRoles = [
  { name: "🛠️ Builder", perms: [R.ManageChannels, R.SendMessages] },
  { name: "⚡ Redstone Genius", perms: [R.ManageChannels, R.ManageMessages] },
  { name: "🌿 Farmer", perms: [R.SendMessages] },
  { name: "🔥 PvP Pro", perms: [R.SendMessages, R.ManageMessages] },
];

// Voice Channels
const voiceCategories = [
  { name: "🎮 Game VCs", perms: [R.ViewChannel] },
  { name: "🔊 Community VCs", perms: [R.ViewChannel] },
  { name: "🛠️ Staff VCs", perms: [R.ViewChannel] },
  { name: "🎥 Creator VCs", perms: [R.ViewChannel] },
];

// Auto-create VC function (example)
const autoCreateVC = async (channel, category) => {
  if(channel.members.size >= 5){ // max 5 per VC
    const newVC = await channel.guild.channels.create({
      name: `${channel.name} 2`,
      type: 2, // Voice
      parent: category,
      permissionOverwrites: channel.permissionOverwrites.cache.map(po => po)
    });
  }
};
// ==============================
// Part 3 - Server Automation, Logs, Content Creator Channels
// ==============================

client.once("ready", async () => {
  console.log(`${client.user.tag} is online!`);

  const guild = client.guilds.cache.first(); // assumes bot is in one server

  // ---------- CREATE ROLES ----------
  for (const r of roles) {
    if (!guild.roles.cache.find(role => role.name === r.name)) {
      await guild.roles.create({
        name: r.name,
        permissions: r.perms,
        reason: "Auto-created by mega bot",
      });
    }
  }

  // ---------- CREATE CATEGORIES ----------
  for (const c of categories) {
    if (!guild.channels.cache.find(ch => ch.name === c.name && ch.type === 4)) {
      await guild.channels.create({
        name: c.name,
        type: 4, // category
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: c.perms,
          },
        ],
      });
    }
  }

  // ---------- CREATE TEXT CHANNELS ----------
  for (const t of textChannels) {
    const cat = guild.channels.cache.find(ch => ch.name === t.category && ch.type === 4);
    if (!guild.channels.cache.find(ch => ch.name === t.name && ch.type === 0)) {
      await guild.channels.create({
        name: t.name,
        type: 0, // text
        parent: cat,
        topic: t.desc,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: t.perms,
          },
        ],
      });
    }
  }

  // ---------- CREATE VOICE CHANNELS ----------
  for (const v of voiceCategories) {
    if (!guild.channels.cache.find(ch => ch.name === v.name && ch.type === 2)) {
      await guild.channels.create({
        name: v.name,
        type: 2, // voice
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            allow: v.perms,
          },
        ],
      });
    }
  }

  console.log("Server setup complete!");
});

// ---------- AUTO-ASSIGN MEMBER ----------
client.on("guildMemberAdd", async member => {
  const role = member.guild.roles.cache.find(r => r.name === "👤 Member");
  if(role) await member.roles.add(role);

  // Welcome log
  const log = member.guild.channels.cache.find(ch => ch.name === "📊 Logs");
  if(log) log.send(`Welcome ${member.user.tag} to the server!`);
});

// ---------- AUTO-REMOVE MEMBER ----------
client.on("guildMemberRemove", async member => {
  const log = member.guild.channels.cache.find(ch => ch.name === "📊 Logs");
  if(log) log.send(`${member.user.tag} has left the server.`);
});

// ---------- AUTO VC CREATION ----------
client.on("voiceStateUpdate", async (oldState, newState) => {
  if(newState.channel && newState.channel.name.includes("VC")) {
    autoCreateVC(newState.channel, newState.channel.parentId);
  }
});
