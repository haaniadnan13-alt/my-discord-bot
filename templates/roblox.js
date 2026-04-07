const { PermissionFlagsBits } = require('discord.js');
const R = PermissionFlagsBits;

module.exports = {
    staff: [
        { name: "👑 GAME OWNER", perms: [R.Administrator] },
        { name: "🛠️ SERVER DIRECTOR", perms: [R.ManageGuild, R.ManageRoles, R.ManageChannels] },
        { name: "⚙️ CREATOR LEAD", perms: [R.ManageChannels] },
        { name: "🛡️ HEAD MODERATOR", perms: [R.KickMembers, R.BanMembers, R.ModerateMembers, R.ManageMessages] },
        { name: "🔨 MODERATOR", perms: [R.KickMembers, R.ModerateMembers, R.ManageMessages] },
        { name: "👀 TRAINEE MODERATOR", perms: [R.ModerateMembers, R.ManageMessages] },
        { name: "🎫 EVENT COORDINATOR", perms: [R.ManageThreads, R.ManageMessages] },
        { name: "💬 CHAT GUARDIAN", perms: [R.ManageMessages] },
        { name: "🎮 MATCH HOST", perms: [R.CreateEvents] },
        { name: "🎬 HIGHLIGHT DIRECTOR", perms: [R.ManageMessages] },
        { name: "🎥 CLIP SCOUT", perms: [R.ManageMessages] },
        { name: "🤖 BOT ENGINEER", perms: [R.ManageChannels, R.ManageMessages] },
        { name: "🧰 SERVER DEVELOPER", perms: [R.ManageChannels, R.ViewAuditLog] }
    ],
    ranks: ["🌟 LEGEND", "💎 ELITE", "🔴 PRO", "🟠 SKILLED", "🟡 PLAYER", "🔵 BEGINNER", "🟢 NOOB"],
    others: ["⭐ VERIFIED", "🧱 BUILDER", "🎨 ARTIST", "🧠 GAME DEVELOPER", "🤝 TEAM PLAYER", "🎬 CONTENT CREATOR", "🎥 CLIP MAKER", "🎉 EVENT PARTICIPANT", "🎭 ROLEPLAYER"],
    categories: [
        { name: "📢┃INFORMATION", channels: ["📜┃RULES", "📣┃ANNOUNCEMENTS", "👋┃WELCOME", "🎭┃ROLES"] },
        { name: "💬┃GENERAL", channels: ["💬┃ROBLOX-CHAT", "🎯┃ROBLOX-LFG", "😂┃ROBLOX-MEMES", "🎬┃ROBLOX-CREATIONS"] },
        { name: "🎧┃VOICE", channels: ["🎤┃ROBLOX-GENERAL", "🎮┃ROBLOX-LFG", "➕┃CREATE-NEW-VC"] },
        { name: "📌┃ROLE CHANNELS", channels: ["🎬┃ROBLOX-CONTENT-CREATOR", "🎥┃ROBLOX-CREATIONS", "🎉┃ROBLOX-EVENT-PARTICIPANTS", "🎭┃ROBLOX-ROLEPLAY"] }
    ]
};
