const { PermissionFlagsBits } = require('discord.js');
const R = PermissionFlagsBits;

module.exports = {
    staff: [
        { name: "👑 COMMANDER-IN-CHIEF", perms: [R.Administrator] },
        { name: "🛠️ OPERATIONS DIRECTOR", perms: [R.ManageGuild, R.ManageRoles, R.ManageChannels] },
        { name: "⚙️ TACTICAL LEAD", perms: [R.ManageChannels] },
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
    ranks: [
        "🚀┃LEGEND", "🌟┃SUPREME", "🏆┃MASTER III", "🏆┃MASTER II", "🏆┃MASTER I", "💎┃DIAMOND III", "💎┃DIAMOND II", "💎┃DIAMOND I",
        "✨┃PLATINUM III", "✨┃PLATINUM II", "✨┃PLATINUM I", "🥇┃GOLD III", "🥇┃GOLD II", "🥇┃GOLD I",
        "🥈┃SILVER III", "🥈┃SILVER II", "🥈┃SILVER I", "🥉┃BRONZE III", "🥉┃BRONZE II", "🥉┃BRONZE I"
    ],
    others: ["⭐ VERIFIED", "🎯 CASUAL", "💣 PRO", "🧠 STRATEGIST", "🤝 TEAM PLAYER", "🎬 CONTENT CREATOR", "🎥 CLIP MAKER", "🎉 EVENT PARTICIPANT", "🎭 ROLEPLAYER"],
    categories: [
        { name: "📢┃INFORMATION", channels: ["📜┃RULES", "📣┃ANNOUNCEMENTS", "👋┃WELCOME", "🎭┃ROLES"] },
        { name: "💬┃GENERAL", channels: ["💬┃COD-CHAT", "🎯┃COD-LFG", "😂┃COD-MEMES", "🎬┃COD-CLIPS"] },
        { name: "🏆┃RANKED CHAT", channels: ["🚀┃LEGEND", "🌟┃SUPREME", "🏆┃MASTER", "💎┃DIAMOND", "✨┃PLATINUM", "🥇┃GOLD", "🥈┃SILVER", "🥉┃BRONZE"] },
        { name: "🎧┃VOICE", channels: ["🎤┃COD-GENERAL", "🎮┃COD-LFG", "➕┃CREATE-NEW-VC"] },
        { name: "📌┃ROLE CHANNELS", channels: ["🎬┃COD-CONTENT-CREATOR", "🎥┃COD-CLIPS", "🎉┃COD-EVENT-PARTICIPANTS", "🎭┃COD-ROLEPLAY"] }
    ]
};
