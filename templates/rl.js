const { PermissionFlagsBits } = require('discord.js');
const R = PermissionFlagsBits;

module.exports = {
    staff: [
        { name: "👑 SUPESONIC OWNER", perms: [R.Administrator] },
        { name: "🛠️ GARAGE DIRECTOR", perms: [R.ManageGuild, R.ManageRoles, R.ManageChannels] },
        { name: "⚙️ ARENA MANAGER", perms: [R.ManageEvents, R.ManageChannels] },
        { name: "🛡️ HEAD REFEREE", perms: [R.KickMembers, R.BanMembers, R.ModerateMembers, R.ManageMessages] },
        { name: "🔨 REFEREE", perms: [R.KickMembers, R.ModerateMembers, R.ManageMessages] },
        { name: "👀 TRAINEE REFEREE", perms: [R.ModerateMembers, R.ManageMessages] },
        { name: "🎫 PIT CREW CHIEF", perms: [R.ManageThreads, R.ManageMessages] },
        { name: "💬 PIT CREW", perms: [R.ManageMessages] },
        { name: "🏆 TOURNAMENT DIRECTOR", perms: [R.ManageEvents] },
        { name: "🎮 MATCH HOST", perms: [R.CreateEvents] },
        { name: "🎬 HIGHLIGHT DIRECTOR", perms: [R.ManageMessages] },
        { name: "🎥 CLIP SCOUT", perms: [R.ManageMessages] },
        { name: "🤖 BOT ENGINEER", perms: [R.ManageChannels, R.ManageMessages] },
        { name: "🧰 ARENA DEVELOPER", perms: [R.ManageChannels, R.ViewAuditLog] }
    ],
    ranks: [
        "🚀 SUPERSONIC LEGEND", "🌟 GRAND CHAMPION III", "🌟 GRAND CHAMPION II", "🌟 GRAND CHAMPION I",
        "🏆 CHAMPION III", "🏆 CHAMPION II", "🏆 CHAMPION I", "💎 DIAMOND III", "💎 DIAMOND II", "💎 DIAMOND I",
        "✨ PLATINUM III", "✨ PLATINUM II", "✨ PLATINUM I", "🥇 GOLD III", "🥇 GOLD II", "🥇 GOLD I",
        "🥈 SILVER III", "🥈 SILVER II", "🥈 SILVER I", "🥉 BRONZE III", "🥉 BRONZE II", "🥉 BRONZE I"
    ],
    others: ["⭐ VERIFIED", "🚗 RL PLAYER", "🎮 CASUAL", "🧠 SWEATY", "🤝 TEAM PLAYER", "🎬 CONTENT CREATOR", "🎥 CLIP MAKER", "🎉 EVENT PARTICIPANT", "🎭 ROLEPLAYER"],
    categories: [
        { name: "📢┃INFORMATION", channels: ["📜┃RULES", "📣┃ANNOUNCEMENTS", "👋┃WELCOME", "🎭┃ROLES"] },
        { name: "💬┃GENERAL", channels: ["💬┃RL-CHAT", "🎯┃RL-LFG", "😂┃RL-MEMES", "🎬┃RL-CLIPS"] },
        { name: "🏆┃RANKED CHAT", channels: ["🚀┃SUPERSONIC LEGEND", "🌟┃GRAND CHAMPION", "🏆┃CHAMPION", "💎┃DIAMOND", "✨┃PLATINUM", "🥇┃GOLD", "🥈┃SILVER", "🥉┃BRONZE"] },
        { name: "🎧┃VOICE", channels: ["🎤┃RL-GENERAL", "🎮┃RL-LFG", "➕┃CREATE-NEW-VC"] },
        { name: "📌┃ROLE CHANNELS", channels: ["🎬┃RL-CONTENT-CREATOR", "🎥┃RL-CLIPS", "🎉┃RL-EVENT-PARTICIPANTS", "🎭┃RL-ROLEPLAY"] }
    ]
};
