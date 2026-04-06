const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder().setName('fun').setDescription('Fun and Games')
            .addSubcommand(s => s.setName('meme').setDescription('Random safe meme'))
            .addSubcommand(s => s.setName('joke').setDescription('Clean family-friendly joke'))
            .addSubcommand(s => s.setName('8ball').setDescription('Magic 8-ball').addStringOption(o => o.setName('question').setRequired(true).setMinLength(3)))
            .addSubcommand(s => s.setName('gif').setDescription('Search for a GIF').addStringOption(o => o.setName('query').setRequired(true)))
            .addSubcommand(s => s.setName('coinflip').setDescription('Flip a coin'))
            .addSubcommand(s => s.setName('roll').setDescription('Roll dice (2-100 sides)').addIntegerOption(o => o.setName('sides').setMinValue(2).setMaxValue(100)))
            .addSubcommand(s => s.setName('mock').setDescription('mOcK tExT').addStringOption(o => o.setName('text').setRequired(true).setMaxLength(200)))
            .addSubcommand(s => s.setName('rate').setDescription('Rate a user').addUserOption(o => o.setName('user').setRequired(true)))
            .addSubcommand(s => s.setName('compliment').setDescription('Send a compliment').addUserOption(o => o.setName('user').setRequired(true)))
            .addSubcommand(s => s.setName('randomnumber').setDescription('Generate number').addIntegerOption(o => o.setName('min').setRequired(true)).addIntegerOption(o => o.setName('max').setRequired(true))),
        async execute(interaction) { /* Fun Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('utility').setDescription('General Utility')
            .addSubcommand(s => s.setName('ping').setDescription('Check latency'))
            .addSubcommand(s => s.setName('uptime').setDescription('Bot uptime'))
            .addSubcommand(s => s.setName('invite').setDescription('Bot invite link'))
            .addSubcommand(s => s.setName('feedback').setDescription('Send feedback').addStringOption(o => o.setName('text').setRequired(true).setMaxLength(500)))
            .addSubcommand(s => s.setName('suggest').setDescription('Create a suggestion').addStringOption(o => o.setName('text').setRequired(true)))
            .addSubcommand(s => s.setName('time').setDescription('Check city time').addStringOption(o => o.setName('city').setRequired(true)))
            .addSubcommand(s => s.setName('weather').setDescription('Check weather').addStringOption(o => o.setName('city').setRequired(true))),
        async execute(interaction) { /* Utility Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('fact').setDescription('Random Facts')
            .addSubcommand(s => s.setName('general').setDescription('Random general fact'))
            .addSubcommand(s => s.setName('animal').setDescription('Random animal image/fact').addStringOption(o => o.setName('type').addChoices({name:'Cat',value:'cat'},{name:'Dog',value:'dog'})))
            .addSubcommand(s => s.setName('space').setDescription('Space fact'))
            .addSubcommand(s => s.setName('history').setDescription('History fact'))
            .addSubcommand(s => s.setName('science').setDescription('Science fact'))
            .addSubcommand(s => s.setName('advice').setDescription('Life advice'))
            .addSubcommand(s => s.setName('motive').setDescription('Motivational quote')),
        async execute(interaction) { /* Fact Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('mod').setDescription('Staff Moderation')
            .addSubcommand(s => s.setName('ban').setDescription('Ban user').addUserOption(o => o.setName('user').setRequired(true)).addStringOption(o => o.setName('reason')))
            .addSubcommand(s => s.setName('kick').setDescription('Kick user').addUserOption(o => o.setName('user').setRequired(true)).addStringOption(o => o.setName('reason')))
            .addSubcommand(s => s.setName('mute').setDescription('Timeout user').addUserOption(o => o.setName('user').setRequired(true)).addStringOption(o => o.setName('time').setRequired(true)))
            .addSubcommand(s => s.setName('unmute').setDescription('Remove timeout').addUserOption(o => o.setName('user').setRequired(true)))
            .addSubcommand(s => s.setName('warn').setDescription('Add warning').addUserOption(o => o.setName('user').setRequired(true)).addStringOption(o => o.setName('reason').setRequired(true)))
            .addSubcommand(s => s.setName('warnings').setDescription('Check warnings').addUserOption(o => o.setName('user').setRequired(true)))
            .addSubcommand(s => s.setName('clear').setDescription('Purge messages').addIntegerOption(o => o.setName('amount').setMinValue(1).setMaxValue(100)))
            .addSubcommand(s => s.setName('slowmode').setDescription('Set slowmode').addIntegerOption(o => o.setName('time').setRequired(true)))
            .addSubcommand(s => s.setName('nickname').setDescription('Change nick').addUserOption(o => o.setName('user').setRequired(true)).addStringOption(o => o.setName('name').setRequired(true)))
            .addSubcommand(s => s.setName('nickreset').setDescription('Reset nick').addUserOption(o => o.setName('user').setRequired(true))),
        async execute(interaction) { /* Mod Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('roles').setDescription('Role Management')
            .addSubcommand(s => s.setName('add').setDescription('Add role').addUserOption(o => o.setName('user').setRequired(true)).addRoleOption(o => o.setName('role').setRequired(true)))
            .addSubcommand(s => s.setName('remove').setDescription('Remove role').addUserOption(o => o.setName('user').setRequired(true)).addRoleOption(o => o.setName('role').setRequired(true)))
            .addSubcommand(s => s.setName('temp').setDescription('Temporary role').addUserOption(o => o.setName('user').setRequired(true)).addRoleOption(o => o.setName('role').setRequired(true)).addStringOption(o => o.setName('time').setRequired(true)))
            .addSubcommand(s => s.setName('mass').setDescription('Add role to everyone').addRoleOption(o => o.setName('role').setRequired(true)))
            .addSubcommand(s => s.setName('massremove').setDescription('Remove from everyone').addRoleOption(o => o.setName('role').setRequired(true)))
            .addSubcommand(s => s.setName('color').setDescription('Change role color').addRoleOption(o => o.setName('role').setRequired(true)).addStringOption(o => o.setName('hex').setRequired(true))),
        async execute(interaction) { /* Role Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('admin').setDescription('Admin Commands')
            .addSubcommand(s => s.setName('lockdown').setDescription('Full server lock'))
            .addSubcommand(s => s.setName('unlockdown').setDescription('Lift server lock'))
            .addSubcommand(s => s.setName('announce').setDescription('Send announcement').addStringOption(o => o.setName('msg').setRequired(true)))
            .addSubcommand(s => s.setName('prune').setDescription('Kick inactive').addIntegerOption(o => o.setName('days').setRequired(true)))
            .addSubcommand(s => s.setName('botstatus').setDescription('Set bot presence').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('serverlock').setDescription('Prevent joins').addStringOption(o => o.setName('toggle').addChoices({name:'On',value:'on'},{name:'Off',value:'off'}))),
        async execute(interaction) { /* Admin Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('automod').setDescription('Toggle Main Automod')
            .addStringOption(o => o.setName('status').setDescription('on/off').setRequired(true).addChoices({name:'On',value:'on'},{name:'Off',value:'off'})),
        async execute(interaction) { /* Automod Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('automod-level').setDescription('Set Protection Intensity')
            .addStringOption(o => o.setName('level').setRequired(true).addChoices(
                {name:'Low',value:'low'},{name:'Mild',value:'mild'},{name:'Strict',value:'strict'},{name:'Extreme',value:'extreme'}
            )),
        async execute(interaction) { /* Level Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('setup').setDescription('Server Configuration')
            .addSubcommand(s => s.setName('logs').setDescription('Set automod logs').addChannelOption(o => o.setName('channel').setRequired(true)))
            .addSubcommand(s => s.setName('modlog').setDescription('Set general mod logs').addChannelOption(o => o.setName('channel').setRequired(true)))
            .addSubcommand(s => s.setName('welcome').setDescription('Welcome channel').addChannelOption(o => o.setName('channel').setRequired(true)))
            .addSubcommand(s => s.setName('welcomemsg').setDescription('Welcome message').addStringOption(o => o.setName('text').setRequired(true)))
            .addSubcommand(s => s.setName('goodbye').setDescription('Goodbye channel').addChannelOption(o => o.setName('channel').setRequired(true)))
            .addSubcommand(s => s.setName('goodbyemsg').setDescription('Goodbye message').addStringOption(o => o.setName('text').setRequired(true)))
            .addSubcommand(s => s.setName('autorole').setDescription('New member role').addRoleOption(o => o.setName('role').setRequired(true)))
            .addSubcommand(s => s.setName('verify').setDescription('Verification role').addRoleOption(o => o.setName('role').setRequired(true))),
        async execute(interaction) { /* Setup Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('antimod').setDescription('Toggle Specific Protections')
            .addSubcommand(s => s.setName('invite').setDescription('Block invites').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('link').setDescription('Block external links').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('spam').setDescription('Anti-spam toggle').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('caps').setDescription('Anti-caps toggle').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('raid').setDescription('Anti-raid toggle').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('ghost').setDescription('Anti-ghost ping').addStringOption(o => o.setName('status').setRequired(true)))
            .addSubcommand(s => s.setName('emoji').setDescription('Anti-emoji spam').addStringOption(o => o.setName('status').setRequired(true))),
        async execute(interaction) { /* Antimod Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('perm').setDescription('Configure command permissions')
            .addStringOption(o => o.setName('command').setRequired(true))
            .addRoleOption(o => o.setName('role').setRequired(true))
            .addStringOption(o => o.setName('status').setRequired(true).addChoices({name:'On',value:'on'},{name:'Off',value:'off'})),
        async execute(interaction) { /* Perm Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('giveaway').setDescription('Giveaway System')
            .addSubcommand(s => s.setName('start').setDescription('Start new giveaway').addStringOption(o => o.setName('time').setRequired(true)).addIntegerOption(o => o.setName('winners').setRequired(true)).addStringOption(o => o.setName('prize').setRequired(true)))
            .addSubcommand(s => s.setName('end').setDescription('End giveaway').addStringOption(o => o.setName('id').setRequired(true)))
            .addSubcommand(s => s.setName('reroll').setDescription('Reroll winner').addStringOption(o => o.setName('id').setRequired(true))),
        async execute(interaction) { /* Giveaway Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('ticket').setDescription('Ticket Support')
            .addSubcommand(s => s.setName('setup').setDescription('Setup ticket panel'))
            .addSubcommand(s => s.setName('close').setDescription('Close ticket'))
            .addSubcommand(s => s.setName('add').setDescription('Add user').addUserOption(o => o.setName('user').setRequired(true)))
            .addSubcommand(s => s.setName('remove').setDescription('Remove user').addUserOption(o => o.setName('user').setRequired(true)))
            .addSubcommand(s => s.setName('log').setDescription('Set ticket log').addChannelOption(o => o.setName('channel').setRequired(true))),
        async execute(interaction) { /* Ticket Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('reactionrole').setDescription('Reaction Role Management')
            .addSubcommand(s => s.setName('add').setDescription('Link emoji to role').addStringOption(o => o.setName('msg_id').setRequired(true)).addStringOption(o => o.setName('emoji').setRequired(true)).addRoleOption(o => o.setName('role').setRequired(true)))
            .addSubcommand(s => s.setName('remove').setDescription('Remove from message').addStringOption(o => o.setName('msg_id').setRequired(true)).addStringOption(o => o.setName('emoji').setRequired(true)))
            .addSubcommand(s => s.setName('list').setDescription('List current reaction roles')),
        async execute(interaction) { /* RR Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('poll').setDescription('Voting System')
            .addSubcommand(s => s.setName('yesno').setDescription('Simple 👍/👎 poll').addStringOption(o => o.setName('question').setRequired(true)))
            .addSubcommand(s => s.setName('multi').setDescription('Multiple choice poll').addStringOption(o => o.setName('question').setRequired(true)).addStringOption(o => o.setName('options').setRequired(true))),
        async execute(interaction) { /* Poll Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('say').setDescription('Bot repeat').addStringOption(o => o.setName('msg').setRequired(true)),
        async execute(interaction) { /* Say Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('embed').setDescription('Send custom embed').addStringOption(o => o.setName('title').setRequired(true)).addStringOption(o => o.setName('description').setRequired(true)),
        async execute(interaction) { /* Embed Logic */ }
    },
    {
        data: new SlashCommandBuilder().setName('botrestart').setDescription('Restart the bot (Owner Only)'),
        async execute(interaction) { /* Restart Logic */ }
    }
];