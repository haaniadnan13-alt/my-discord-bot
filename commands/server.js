const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  OverwriteType,
} = require('discord.js');

if (!global.settings) global.settings = {};
if (!global.giveaways) global.giveaways = {};
if (!global.cmdPerms) global.cmdPerms = {};

// ─── Permission helper ────────────────────────────────────────────────────────
function isCommandDisabled(interaction) {
  const guildPerms = global.cmdPerms[interaction.guild.id];
  if (!guildPerms) return false;
  const entry = guildPerms[interaction.commandName];
  if (!entry) return false;
  if (entry.disabled) return true;
  if (entry.requiredRole) {
    return !interaction.member.roles.cache.has(entry.requiredRole);
  }
  return false;
}

// ─── Server Templates ─────────────────────────────────────────────────────────
const SERVER_GENRES = {
  '🎮 Action': {
    servers: {
      'Valorant': {
        description: 'A tactical 5v5 shooter by Riot Games. Master your agents and dominate the competition.',
        color: 0xFF4655,
        icon: '🎯',
        roles: [
          { name: '🔫 Radiant', color: 0xFF4655, hoist: true, permissions: PermissionsBitField.Flags.Administrator },
          { name: '⚔️ Immortal', color: 0x9B59B6, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers },
          { name: '🛡️ Diamond Mod', color: 0x3498DB, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.MuteMembers },
          { name: '🔰 Trial Agent', color: 0x1ABC9C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages },
          { name: '💎 Diamond', color: 0x3498DB, hoist: false },
          { name: '🥇 Platinum', color: 0x1ABC9C, hoist: false },
          { name: '⭐ Gold', color: 0xF1C40F, hoist: false },
          { name: '🥈 Silver', color: 0x95A5A6, hoist: false },
          { name: '🎮 Iron', color: 0x7F8C8D, hoist: false },
          { name: '✅ Verified Agent', color: 0x2ECC71, hoist: false },
          { name: '🤖 Bot', color: 0x2C3E50, hoist: false },
        ],
        modRoleName: '⚔️ Immortal',
        trialModRoleName: '🔰 Trial Agent',
        adminRoleName: '🔫 Radiant',
        everyoneCanView: true,
        categories: [
          {
            name: '📌 INFORMATION',
            everyoneRead: true,
            everyoneWrite: false,
            channels: [
              { name: '📢・announcements', type: 'text', everyoneWrite: false },
              { name: '📜・server-rules', type: 'text', everyoneWrite: false },
              { name: '🔄・valorant-patch-notes', type: 'text', everyoneWrite: false },
            ]
          },
          {
            name: '🎮 GENERAL',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '💬・valorant-general', type: 'text' },
              { name: '🎯・clutch-clips', type: 'text' },
              { name: '📊・rank-showcase', type: 'text' },
              { name: '🤝・looking-for-5stack', type: 'text' },
            ]
          },
          {
            name: '🗓️ AGENTS',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '⚡・duelists-chat', type: 'text' },
              { name: '🛡️・controllers-chat', type: 'text' },
              { name: '💫・sentinels-chat', type: 'text' },
              { name: '🔍・initiators-chat', type: 'text' },
            ]
          },
          {
            name: '🔊 VOICE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🎙️ Spike Rush', type: 'voice' },
              { name: '🎙️ Competitive Queue', type: 'voice' },
              { name: '🎮 Unrated Chill', type: 'voice' },
            ]
          },
          {
            name: '🔒 STAFF ZONE',
            everyoneRead: false,
            everyoneWrite: false,
            modOnly: true,
            channels: [
              { name: '🔫・radiant-command', type: 'text' },
              { name: '⚔️・immortal-mod-chat', type: 'text' },
              { name: '🔰・trial-agent-lounge', type: 'text' },
              { name: '📋・moderation-logs', type: 'text' },
            ]
          },
          {
            name: '🤖 BOTS',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🤖・spike-bot-commands', type: 'text' },
            ]
          }
        ],
        welcome: '🎯 Welcome to the **Valorant** hub, {user}! Choose your rank role and hop in a game. Remember: **spike is everything.** 💥'
      },
      'Fortnite': {
        description: 'Drop into the island, build your way to victory, and be the last one standing.',
        color: 0x00D4FF,
        icon: '⚡',
        roles: [
          { name: '👑 Victory Royale', color: 0xFFD700, hoist: true, permissions: PermissionsBitField.Flags.Administrator },
          { name: '🏆 Champion Squad', color: 0x9B59B6, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers },
          { name: '⚡ Storm Mod', color: 0x3498DB, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.MuteMembers },
          { name: '🔰 Trial Looter', color: 0x1ABC9C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages },
          { name: '💎 Elite Builder', color: 0x3498DB, hoist: false },
          { name: '⚡ Gold Guerrilla', color: 0xF39C12, hoist: false },
          { name: '🥈 Silver Soldier', color: 0x95A5A6, hoist: false },
          { name: '🥉 Bronze Dropper', color: 0xCD6133, hoist: false },
          { name: '🎮 Open League', color: 0x7F8C8D, hoist: false },
          { name: '✅ Verified Islander', color: 0x2ECC71, hoist: false },
          { name: '🤖 Bot', color: 0x2C3E50, hoist: false },
        ],
        modRoleName: '🏆 Champion Squad',
        trialModRoleName: '🔰 Trial Looter',
        adminRoleName: '👑 Victory Royale',
        everyoneCanView: true,
        categories: [
          {
            name: '📌 INFORMATION',
            everyoneRead: true,
            everyoneWrite: false,
            channels: [
              { name: '📢・battle-bus-announcements', type: 'text', everyoneWrite: false },
              { name: '📜・island-rules', type: 'text', everyoneWrite: false },
              { name: '🔄・fortnite-updates', type: 'text', everyoneWrite: false },
            ]
          },
          {
            name: '🏝️ THE ISLAND',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '💬・island-general', type: 'text' },
              { name: '🎬・victory-royale-clips', type: 'text' },
              { name: '🏆・win-leaderboard', type: 'text' },
              { name: '🤝・squad-finder', type: 'text' },
            ]
          },
          {
            name: '⚡ COMPETITIVE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🏆・fncs-discussion', type: 'text' },
              { name: '📊・stats-tracker', type: 'text' },
              { name: '🎯・scrims-zone', type: 'text' },
            ]
          },
          {
            name: '🔊 VOICE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🎙️ Squad Drop', type: 'voice' },
              { name: '🎙️ Build Practice', type: 'voice' },
              { name: '🎮 Zero Build Lobby', type: 'voice' },
            ]
          },
          {
            name: '🔒 STORM CIRCLE STAFF',
            everyoneRead: false,
            everyoneWrite: false,
            modOnly: true,
            channels: [
              { name: '👑・royale-command', type: 'text' },
              { name: '🏆・champion-mod-chat', type: 'text' },
              { name: '🔰・trial-looter-lounge', type: 'text' },
              { name: '📋・staff-action-logs', type: 'text' },
            ]
          },
          {
            name: '🤖 BOTS',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🤖・bus-bot-commands', type: 'text' },
            ]
          }
        ],
        welcome: '⚡ Welcome to the **Fortnite** hub, {user}! The Battle Bus is boarding. Grab your pickaxe and lets get that Victory Royale! 🏆'
      },
      'Call of Duty': {
        description: 'The iconic military shooter. Dominate in Warzone and multiplayer.',
        color: 0x3A3A3A,
        icon: '🔫',
        roles: [
          { name: '🎖️ General of the Army', color: 0xFFD700, hoist: true, permissions: PermissionsBitField.Flags.Administrator },
          { name: '⭐ Field Commander', color: 0xE74C3C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers },
          { name: '🪖 Sergeant Mod', color: 0x3498DB, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.MuteMembers },
          { name: '🔰 Trial Recruit', color: 0x1ABC9C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages },
          { name: '💎 Prestige Master', color: 0x9B59B6, hoist: false },
          { name: '🥇 Legend Rank', color: 0xF1C40F, hoist: false },
          { name: '🥈 Veteran Soldier', color: 0x95A5A6, hoist: false },
          { name: '🥉 Private', color: 0xCD6133, hoist: false },
          { name: '🎮 Fresh Recruit', color: 0x7F8C8D, hoist: false },
          { name: '✅ Verified Soldier', color: 0x2ECC71, hoist: false },
          { name: '🤖 Bot', color: 0x2C3E50, hoist: false },
        ],
        modRoleName: '⭐ Field Commander',
        trialModRoleName: '🔰 Trial Recruit',
        adminRoleName: '🎖️ General of the Army',
        everyoneCanView: true,
        categories: [
          {
            name: '📌 INFORMATION',
            everyoneRead: true,
            everyoneWrite: false,
            channels: [
              { name: '📢・command-announcements', type: 'text' },
              { name: '📜・rules-of-engagement', type: 'text' },
              { name: '🔄・cod-updates', type: 'text' },
            ]
          },
          {
            name: '🔫 WARZONE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '💬・warzone-general', type: 'text' },
              { name: '🎬・killstreak-clips', type: 'text' },
              { name: '🤝・squad-up', type: 'text' },
              { name: '🎮・loadout-builder', type: 'text' },
            ]
          },
          {
            name: '💥 MULTIPLAYER',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🗺️・map-strategies', type: 'text' },
              { name: '🏆・ranked-wins', type: 'text' },
              { name: '🎯・meta-loadouts', type: 'text' },
            ]
          },
          {
            name: '🔊 VOICE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🎙️ Squad Alpha', type: 'voice' },
              { name: '🎙️ Squad Bravo', type: 'voice' },
              { name: '🎮 Casual Lobby', type: 'voice' },
            ]
          },
          {
            name: '🔒 COMMAND CENTER',
            everyoneRead: false,
            everyoneWrite: false,
            modOnly: true,
            channels: [
              { name: '🎖️・general-orders', type: 'text' },
              { name: '⭐・commander-mod-chat', type: 'text' },
              { name: '🔰・trial-recruit-briefing', type: 'text' },
              { name: '📋・action-reports', type: 'text' },
            ]
          },
          {
            name: '🤖 BOTS',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🤖・killbot-commands', type: 'text' },
            ]
          }
        ],
        welcome: '🔫 Welcome to the **Call of Duty** server, {user}! Report for duty soldier. Pick your loadout and join a squad! 🎖️'
      },
      'Marvel Rivals': {
        description: 'Team-based action where Marvel heroes and villains clash in epic battles.',
        color: 0xE23636,
        icon: '🦸',
        roles: [
          { name: '⭐ Celestial One', color: 0xFFD700, hoist: true, permissions: PermissionsBitField.Flags.Administrator },
          { name: '💎 Diamond Avenger', color: 0x3498DB, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers },
          { name: '🛡️ Shield Mod', color: 0x1ABC9C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.MuteMembers },
          { name: '🔰 Trial Sidekick', color: 0xE74C3C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages },
          { name: '🏆 Platinum Hero', color: 0x1ABC9C, hoist: false },
          { name: '🥇 Gold Guardian', color: 0xF1C40F, hoist: false },
          { name: '🥈 Silver Striker', color: 0x95A5A6, hoist: false },
          { name: '🥉 Bronze Brawler', color: 0xCD6133, hoist: false },
          { name: '🦸 Rookie Hero', color: 0xE23636, hoist: false },
          { name: '✅ Verified Hero', color: 0x2ECC71, hoist: false },
          { name: '🤖 Bot', color: 0x2C3E50, hoist: false },
        ],
        modRoleName: '💎 Diamond Avenger',
        trialModRoleName: '🔰 Trial Sidekick',
        adminRoleName: '⭐ Celestial One',
        everyoneCanView: true,
        categories: [
          {
            name: '📌 INFORMATION',
            everyoneRead: true,
            everyoneWrite: false,
            channels: [
              { name: '📢・avengers-announcements', type: 'text' },
              { name: '📜・hero-code-of-conduct', type: 'text' },
              { name: '🔄・rivals-patch-notes', type: 'text' },
            ]
          },
          {
            name: '🦸 HERO HQ',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '💬・rivals-general', type: 'text' },
              { name: '🎬・hero-highlight-reel', type: 'text' },
              { name: '🦸・hero-tier-list', type: 'text' },
              { name: '🤝・team-assembler', type: 'text' },
            ]
          },
          {
            name: '⚔️ RANKED',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '📊・rank-showcase', type: 'text' },
              { name: '🎯・team-compositions', type: 'text' },
              { name: '🏆・tournament-zone', type: 'text' },
            ]
          },
          {
            name: '🔊 VOICE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🎙️ Team Alpha', type: 'voice' },
              { name: '🎙️ Team Omega', type: 'voice' },
              { name: '🎮 Casual Brawl', type: 'voice' },
            ]
          },
          {
            name: '🔒 SHIELD HEADQUARTERS',
            everyoneRead: false,
            everyoneWrite: false,
            modOnly: true,
            channels: [
              { name: '⭐・celestial-command', type: 'text' },
              { name: '💎・avenger-mod-chat', type: 'text' },
              { name: '🔰・trial-sidekick-briefing', type: 'text' },
              { name: '📋・hero-action-logs', type: 'text' },
            ]
          },
          {
            name: '🤖 BOTS',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🤖・jarvis-commands', type: 'text' },
            ]
          }
        ],
        welcome: '🦸 Welcome to **Marvel Rivals**, {user}! Assemble your team and show the multiverse who\'s the strongest hero! ⚡'
      }
    }
  },
  '🎲 Casual': {
    servers: {
      'Minecraft': {
        description: 'Build, survive, and explore in the ultimate sandbox world.',
        color: 0x5D8A1E,
        icon: '⛏️',
        roles: [
          { name: '💎 Herobrine', color: 0x3498DB, hoist: true, permissions: PermissionsBitField.Flags.Administrator },
          { name: '🌿 Creeper Boss', color: 0x27AE60, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.KickMembers | PermissionsBitField.Flags.BanMembers },
          { name: '🔴 Redstone Mod', color: 0xE74C3C, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages | PermissionsBitField.Flags.MuteMembers },
          { name: '🔰 Trial Miner', color: 0xF1C40F, hoist: true, permissions: PermissionsBitField.Flags.ManageMessages },
          { name: '🥇 Diamond Miner', color: 0x3498DB, hoist: false },
          { name: '🔵 Lapis Scholar', color: 0x2980B9, hoist: false },
          { name: '🌿 Emerald Trader', color: 0x27AE60, hoist: false },
          { name: '⛏️ Iron Pickaxe', color: 0x5D8A1E, hoist: false },
          { name: '🪵 Wood Axe', color: 0xCD6133, hoist: false },
          { name: '✅ Verified Crafter', color: 0x2ECC71, hoist: false },
          { name: '🤖 Bot', color: 0x2C3E50, hoist: false },
        ],
        modRoleName: '🌿 Creeper Boss',
        trialModRoleName: '🔰 Trial Miner',
        adminRoleName: '💎 Herobrine',
        everyoneCanView: true,
        categories: [
          {
            name: '📌 INFORMATION',
            everyoneRead: true,
            everyoneWrite: false,
            channels: [
              { name: '📢・spawn-announcements', type: 'text' },
              { name: '📜・server-rules', type: 'text' },
              { name: '🌐・server-ip-info', type: 'text' },
            ]
          },
          {
            name: '⛏️ THE OVERWORLD',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '💬・overworld-chat', type: 'text' },
              { name: '🏗️・build-showcase', type: 'text' },
              { name: '🔴・redstone-engineering', type: 'text' },
              { name: '🌿・farm-designs', type: 'text' },
              { name: '🤝・smp-finder', type: 'text' },
            ]
          },
          {
            name: '🌍 SURVIVAL',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🏡・base-tours', type: 'text' },
              { name: '🗺️・seed-drops', type: 'text' },
            ]
          },
          {
            name: '🔊 VOICE',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '⛏️ Mining Crew', type: 'voice' },
              { name: '🏗️ Build Session', type: 'voice' },
              { name: '🎮 SMP Hangout', type: 'voice' },
            ]
          },
          {
            name: '🔒 NETHER FORTRESS STAFF',
            everyoneRead: false,
            everyoneWrite: false,
            modOnly: true,
            channels: [
              { name: '💎・herobrine-orders', type: 'text' },
              { name: '🌿・creeper-mod-chat', type: 'text' },
              { name: '🔰・trial-miner-den', type: 'text' },
              { name: '📋・ban-hammer-logs', type: 'text' },
            ]
          },
          {
            name: '🤖 BOTS',
            everyoneRead: true,
            everyoneWrite: true,
            channels: [
              { name: '🤖・crafting-bot-commands', type: 'text' },
            ]
          }
        ],
        welcome: '⛏️ Welcome to the **Minecraft** server, {user}! Grab your pickaxe, punch a tree, and let\'s build something amazing! 🌍'
      },
      'Among Us': {
        description: 'Find the impostors — or be one. Social deduction at its finest.',
        color: 0xC51111,
        icon: '🔴',
        roles: [
          { name: '👾 Polus Admin', color: 0xC51111, hoist: true, permissions: Pe
