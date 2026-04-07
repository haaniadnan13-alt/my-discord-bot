const { PermissionFlagsBits } = require('discord.js');
const R = PermissionFlagsBits;

module.exports = {
    staff: [
        { name: "👑 BATTLEFIELD OWNER", perms: [R.Administrator] },
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
        "🚀┃LEGENDARY", "🌟┃APEX PREDATOR", "🏆┃MASTER III", "🏆┃MASTER II", "🏆┃MASTER I", "💎┃DIAMOND III", "💎┃DIAMOND II", "💎┃DIAMOND I",
        "✨┃PLATINUM III", "✨┃PLATINUM II", "✨┃PLATINUM I", "🥇┃GOLD III", "🥇┃GOLD II", "🥇┃GOLD I",
        "🥈┃SILVER III", "🥈┃SILVER II", "🥈┃SILVER I", "🥉┃BRONZE III", "🥉┃BRONZE II", "🥉┃BRONZE I"
    ],
    others: ["⭐ VERIFIED", "🎯 CASUAL", "💣 PRO", "🧠 STRATEGIST", "🤝 TEAM PLAYER", "🎬 CONTENT CREATOR", "🎥 CLIP MAKER", "🎉 EVENT PARTICIPANT", "🎭 ROLEPLAYER"],
    categories: [
        { name: "📢┃INFORMATION", channels: ["📜┃RULES", "📣┃ANNOUNCEMENTS", "👋┃WELCOME", "🎭┃ROLES"] },
        { name: "💬┃GENERAL", channels: ["💬┃APEX-CHAT", "🎯┃APEX-LFG", "😂┃APEX-MEMES", "🎬┃APEX-CLIPS"] },
        { name: "🏆┃RANKED CHAT", channels: ["🚀┃LEGENDARY", "🌟┃APEX PREDATOR", "🏆┃MASTER", "💎┃DIAMOND", "✨┃PLATINUM", "🥇┃GOLD", "🥈┃SILVER", "🥉┃BRONZE"] },
        { name: "🎧┃VOICE", channels: ["🎤┃APEX-GENERAL", "🎮┃APEX-LFG", "➕┃CREATE-NEW-VC"] },
        { name: "📌┃ROLE CHANNELS", channels: ["🎬┃APEX-CONTENT-CREATOR", "🎥┃APEX-CLIPS", "🎉┃APEX-EVENT-PARTICIPANTS", "🎭┃APEX-ROLEPLAY"] }
    ]
};
