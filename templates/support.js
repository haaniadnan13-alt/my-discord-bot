const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    roles: [
        { n: '👑 Owner', c: '#8B0000', p: [PermissionFlagsBits.Administrator] },
        { n: '🛠️ Co-Owner', c: '#FF0000', p: [PermissionFlagsBits.Administrator] },
        { n: '⚙️ Admin', c: '#FFA500', p: [PermissionFlagsBits.ManageGuild, PermissionFlagsBits.ManageChannels] },
        { n: '🛡️ Senior Moderator', c: '#FFD700', p: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers] },
        { n: '🔧 Moderator', c: '#FFFF00', p: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers] },
        { n: '🎫 Ticket Manager', c: '#008000', p: [PermissionFlagsBits.ManageMessages] },
        { n: '✅ Verified', c: '#3498db', p: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
    ],
    rulesList: [
        "1️⃣ **Respect**: Be respectful to all members and staff. No harassment or hate speech.",
        "2️⃣ **No Spam**: No spamming, mass mentioning, or unnecessary use of CAPS.",
        "3️⃣ **Organization**: Keep conversations in the correct channels (bugs in bug-reports, etc).",
        "4️⃣ **Safety**: No NSFW content, gore, or illegal links.",
        "5️⃣ **Support**: Do not DM staff for support; please open a ticket in 🎫┃OPEN-A-TICKET."
    ],
    categories: [
        {
            name: '🔐┃VERIFICATION',
            isVerify: true,
            channels: [{ n: '✅┃verify-here', d: 'Welcome! Click the button below to verify and unlock the full server.' }]
        },
        {
            name: '📢┃INFORMATION',
            isPublic: true, 
            channels: [
                { n: '📜┃rules', d: 'Official community guidelines.', autoRules: true },
                { n: '📣┃announcements', d: 'Critical updates regarding the bot and server.' },
                { n: '👋┃welcome', d: 'Welcome to our support community!' },
                { n: '👋┃bye', d: 'We are sorry to see you go.' },
                { n: '🎫┃open-a-ticket', d: 'Click the button below to open a private ticket for staff assistance.', isTicket: true }
            ]
        },
        {
            name: '💬┃GENERAL',
            channels: [
                { n: '💬┃general-chat', d: 'The main hub for our community.' },
                { n: '❓┃help', d: 'Quick community-driven assistance.' },
                { n: '🐞┃bug-reports', d: 'Report glitches or errors here.' },
                { n: '💡┃suggestions', d: 'Share your ideas to improve the bot.' }
            ]
        },
        {
            name: '🎧┃VOICE',
            isVoice: true,
            channels: [
                { n: '🎤┃support-vc', d: 'Real-time troubleshooting voice channel.' },
                { n: '➕┃create-new-vc', d: 'Join to create a private temporary room.' }
            ]
        },
        {
            name: '👑┃STAFF CATEGORY',
            staffOnly: true,
            channels: [
                { n: '💬┃staff-chat', d: 'Internal coordination for the team.' },
                { n: '📝┃logs', d: 'Security audit logs.' }
            ]
        }
    ]
};
