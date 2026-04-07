const { PermissionFlagsBits } = require('discord.js');
const R = PermissionFlagsBits;

module.exports = {
    staff: [
        { name: "👑 OVERWORLD OWNER", perms: [R.Administrator] },
        { name: "🛠️ BUILD MASTER", perms: [R.ManageGuild, R.ManageRoles, R.ManageChannels] },
        { name: "⚙️ REDSTONE GENIUS", perms: [R.ManageChannels] },
        { name: "🛡️ HEAD MODERATOR", perms: [R.KickMembers, R.BanMembers, R.ModerateMembers, R.ManageMessages] },
        { name: "🔨 MODERATOR", perms: [R.KickMembers, R.ModerateMembers, R.ManageMessages] },
        { name: "👀 TRAINEE MODERATOR", perms: [R.ModerateMembers, R.ManageMessages] },
        { name: "🎫 EVENT COORDINATOR", perms: [R.ManageThreads, R.ManageMessages] },
        { name: "💬 CHAT GUARDIAN", perms: [R.ManageMessages] },
        { name: "🎮 GAME HOST", perms: [R.CreateEvents] },
        { name: "🎬 BUILD DIRECTOR", perms: [R.ManageChannels] },
        { name: "🎥 VIDEO SCOUT", perms: [R.ManageChannels] },
        { name: "🤖 BOT ENGINEER", perms: [R.ManageChannels, R.ManageMessages] },
        { name: "🧰 SERVER DEVELOPER", perms: [R.ManageChannels, R.ViewAuditLog] }
    ],
    ranks: [
        "🚀┃SUPREME", "🌟┃OBSIDIAN III", "🌟┃OBSIDIAN II", "🌟┃OBSIDIAN I", "🏆┃EMERALD III", "🏆┃EMERALD II", "🏆┃EMERALD I",
        "💎┃DIAMOND III", "💎┃DIAMOND II", "💎┃DIAMOND I", "✨┃PLATINUM III", "✨┃PLATINUM II", "✨┃PLATINUM I",
        "🥇┃GOLD III", "🥇┃GOLD II", "🥇┃GOLD I", "🥈┃SILVER III", "🥈┃SILVER II", "🥈┃SILVER I", "🥉┃BRONZE III", "🥉┃BRONZE II", "🥉┃BRONZE I"
    ],
    others: ["⭐ VERIFIED", "🧱 BUILDER", "🪓 MINER", "🧠 REDSTONE ENGINEER", "🤝 TEAM PLAYER", "🎬 CONTENT CREATOR", "🎥 CLIP MAKER", "🎉 EVENT PARTICIPANT", "🎭 ROLEPLAYER"],
    categories: [
        { name: "📢┃INFORMATION", channels: ["📜┃RULES", "📣┃ANNOUNCEMENTS", "👋┃WELCOME", "🎭┃ROLES"] },
        { name: "💬┃GENERAL", channels: ["💬┃MC-CHAT", "🎯┃MC-LFG", "😂┃MC-MEMES", "🎬┃MC-BUILDS"] },
        { name: "🏆┃RANKED CHAT", channels: ["🚀┃SUPREME", "🌟┃OBSIDIAN", "🏆┃EMERALD", "💎┃DIAMOND", "✨┃PLATINUM", "🥇┃GOLD", "🥈┃SILVER", "🥉┃BRONZE"] },
        { name: "🎧┃VOICE", channels: ["🎤┃MC-GENERAL", "🎮┃MC-LFG", "➕┃CREATE-NEW-VC"] },
        { name: "📌┃ROLE CHANNELS", channels: ["🎬┃MC-CONTENT-CREATOR", "🎥┃MC-BUILDS", "🎉┃MC-EVENT-PARTICIPANTS", "🎭┃MC-ROLEPLAY"] }
    ]
};
