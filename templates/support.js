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
    // These rules will be automatically sent to the rules channel
    rulesList: [
        "1️⃣ Be respectful to all members and staff. No harassment or hate speech.",
        "2️⃣ No spamming, mass mentioning, or unnecessary use of CAPS.",
        "3️⃣ Keep conversations in the correct channels (bugs in bug-reports, etc).",
        "4️⃣ No NSFW content, gore, or illegal links. This is a safe support server.",
        "5️⃣ Do not DM staff for support; please open a ticket in 🎫┃OPEN-A-TICKET."
    ],
    categories: [
        {
            name: '🔐┃VERIFICATION',
            isVerify: true,
            channels: [{ n: '✅┃verify-here', d: 'Welcome to the server! To prevent bots and maintain security, you must verify your account. Once you click the button below, this channel will disappear and the rest of the server will become visible to you.' }]
        },
        {
            name: '📢┃INFORMATION',
            isPublic: true, // Read-only for members
            channels: [
                { n: '📜┃rules', d: 'Please read our official community guidelines carefully. By staying in this server, you agree to follow these rules. Failure to comply may result in a mute, kick, or permanent ban from the staff.' },
                { n: '📣┃announcements', d: 'Stay updated with the latest bot developments, maintenance schedules, and major server changes. Check here frequently to ensure you never miss an important update.' },
                { n: '👋┃welcome', d: 'A warm welcome to all our new members! We are glad to have you here. Feel free to introduce yourself in general chat once you have verified.' },
                { n: '👋┃bye', d: 'Farewell to those leaving our community. We hope our support tools helped you while you were here. You are always welcome back!' },
                { n: '🎫┃open-a-ticket', d: 'Need professional assistance? Click the button in this channel to open a private ticket. Our staff team will be notified immediately to help you with your specific issue or inquiry.' }
            ]
        },
        {
            name: '💬┃GENERAL',
            channels: [
                { n: '💬┃general-chat', d: 'The main hub for our community. Chat with other users about the bot, ask general questions, or just hang out with the rest of the members.' },
                { n: '❓┃help', d: 'Need a quick answer? Use this channel for fast community-driven support. If your issue is complex, please consider opening a formal ticket instead.' },
                { n: '🐞┃bug-reports', d: 'Help us improve! If you encounter any glitches or errors, please report them here with screenshots and a clear description of how to reproduce the bug.' },
                { n: '💡┃suggestions', d: 'Have an idea to make the bot better? Share your creative thoughts here. We review every suggestion and use community feedback to plan future updates.' }
            ]
        },
        {
            name: '🎧┃VOICE',
            channels: [
                { n: '🎤┃support-vc', d: 'Join this voice channel if a staff member has requested a screen share or voice call to troubleshoot your issue in real-time.' },
                { n: '➕┃create-new-vc', d: 'Join this channel to automatically generate your own private voice room. You will have control over who can join your temporary session.' }
            ]
        },
        {
            name: '👑┃STAFF CATEGORY',
            staffOnly: true,
            channels: [
                { n: '💬┃staff-chat', d: 'Private coordination area for the staff team. Discuss moderation actions, ticket statuses, and upcoming server events here.' },
                { n: '📝┃logs', d: 'Detailed audit logs for every action taken in the server. This channel tracks message edits, deleted content, and member movements for security.' }
            ]
        }
    ]
};
