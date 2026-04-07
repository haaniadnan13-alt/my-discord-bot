const { PermissionFlagsBits } = require('discord.js');
const R = PermissionFlagsBits;

module.exports = {
    staff: [
        { name: "👑 OWNER", perms: [R.Administrator] },
        { name: "🛠️ ADMIN", perms: [R.ManageGuild, R.ManageRoles, R.ManageChannels] },
        { name: "⚙️ MODERATOR", perms: [R.ManageMessages, R.MoveMembers, R.MuteMembers] },
        { name: "🛡️ JR MOD", perms: [R.ManageMessages, R.ModerateMembers] },
        { name: "👀 HELPER", perms: [R.ManageMessages] },
        { name: "🎫 EVENT HOST", perms: [R.ManageEvents] },
        { name: "🎥 CLIP MANAGER", perms: [R.ManageMessages] },
        { name: "🤖 BOT ENGINEER", perms: [R.ManageChannels, R.ManageMessages] },
        { name: "🧰 DEVELOPER", perms: [R.ManageChannels, R.ViewAuditLog] }
    ],
    ranks: [
        "🚀┃ARCHNEMESIS", "🌟┃NEMESIS", "🏆┃ONYX",
        "💎┃DIAMOND III", "💎┃DIAMOND II", "💎┃DIAMOND I",
        "✨┃PLATINUM III", "✨┃PLATINUM II", "✨┃PLATINUM I",
        "🥇┃GOLD III", "🥇┃GOLD II", "🥇┃GOLD I",
        "🥈┃SILVER III", "🥈┃SILVER II", "🥈┃SILVER I",
        "🥉┃BRONZE III", "🥉┃BRONZE II", "🥉┃BRONZE I"
    ],
    others: ["⭐ VERIFIED", "🏆 RIVALS PLAYER", "🎮 CASUAL RIVAL", "🔥 COMPETITIVE RIVAL", "🤝 TEAM SQUAD", "🎬 CONTENT CREATOR", "🎥 CLIP MAKER", "🎉 EVENT PARTICIPANT", "🎭 ROLEPLAYER"],
    categories: [
        { name: "📢┃INFORMATION", channels: ["📜┃RULES", "📣┃rivals-announcements", "👋┃WELCOME", "🎭┃ROLES"] },
        { name: "💬┃CHANNELS", channels: ["💬┃rivals-chat", "🎯┃rivals-lfg", "⚔️┃rivals-ranked-discussion"] },
        { name: "🎧┃VOICE", channels: ["🎤┃rivals-general", "➕┃CREATE-NEW-VC"] },
        { name: "📌┃ROLE CHANNELS", channels: ["🎬┃rivals-content-creator", "🎥┃rivals-clips", "🎉┃rivals-event-participants", "🎭┃rivals-roleplay"] }
    ]
};
