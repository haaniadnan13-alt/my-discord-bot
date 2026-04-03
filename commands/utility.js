const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Check bot latency'),
    async execute(interaction) {
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🏓 Pong!').setDescription(`Bot latency: **${interaction.client.ws.ping}ms**`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('help')
      .setDescription('Show all commands'),
    async execute(interaction) {
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('📋 Help Menu').setDescription(
        '**Moderation:**\n/ban /kick /mute /unmute /timeout /untimeout /warn /warnings /clear /slowmode /lock /unlock /nick /role /softban\n\n' +
        '**Utility:**\n/ping /help /userinfo /serverinfo /avatar /banner /botinfo /uptime /invite /say /embed /timestamp /calc /remind\n\n' +
        '**Fun:**\n/meme /joke /8ball /coinflip /roll /gif /reverse /choose /rate /ascii\n\n' +
        '**Server:**\n/welcome /goodbye /autorole /verify /ticket /close /announce /poll /suggest /reactionrole /giveaway /endgiveaway /reroll /counting /sticky /permission'
      )] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('userinfo')
      .setDescription('Get info about a user')
      .addUserOption(o => o.setName('user').setDescription('User to check')),
    async execute(interaction) {
      const member = interaction.options.getMember('user') || interaction.member;
      const user = member.user;
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle(`👤 ${user.tag}`).setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: 'ID', value: user.id, inline: true },
          { name: 'Nickname', value: member.nickname || 'None', inline: true },
          { name: 'Joined Server', value: member.joinedAt.toLocaleDateString(), inline: true },
          { name: 'Account Created', value: user.createdAt.toLocaleDateString(), inline: true },
          { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') || 'None' }
        )] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('serverinfo')
      .setDescription('Get info about the server'),
    async execute(interaction) {
      const guild = interaction.guild;
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle(`🏠 ${guild.name}`)
        .setThumbnail(guild.iconURL())
        .addFields(
          { name: 'Members', value: `${guild.memberCount}`, inline: true },
          { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
          { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
          { name: 'Created', value: guild.createdAt.toLocaleDateString(), inline: true },
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true }
        )] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('avatar')
      .setDescription('Show a users avatar')
      .addUserOption(o => o.setName('user').setDescription('User to check')),
    async execute(interaction) {
      const user = interaction.options.getUser('user') || interaction.user;
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle(`🖼️ ${user.tag}'s Avatar`).setImage(user.displayAvatarURL({ size: 512 }))] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('banner')
      .setDescription('Show a users banner')
      .addUserOption(o => o.setName('user').setDescription('User to check')),
    async execute(interaction) {
      const user = await (interaction.options.getUser('user') || interaction.user).fetch();
      const banner = user.bannerURL({ size: 512 });
      if (!banner) return interaction.reply({ content: '❌ This user has no banner!', ephemeral: true });
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle(`🖼️ ${user.tag}'s Banner`).setImage(banner)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('botinfo')
      .setDescription('Get info about the bot'),
    async execute(interaction) {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🤖 Bot Info')
        .addFields(
          { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
          { name: 'Uptime', value: `${hours}h ${minutes}m`, inline: true },
          { name: 'Latency', value: `${interaction.client.ws.ping}ms`, inline: true }
        )] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('uptime')
      .setDescription('Check how long the bot has been online'),
    async execute(interaction) {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('⏱️ Uptime').setDescription(`Bot has been online for **${hours}h ${minutes}m ${seconds}s**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('invite')
      .setDescription('Get the bot invite link'),
    async execute(interaction) {
      const link = `https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot%20applications.commands`;
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('📨 Invite Me!').setDescription(`[Click here to invite the bot!](${link})`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('say')
      .setDescription('Make the bot say something')
      .addStringOption(o => o.setName('message').setDescription('Message to say').setRequired(true)),
    async execute(interaction) {
      const msg = interaction.options.getString('message');
      await interaction.channel.send(msg);
      interaction.reply({ content: '✅ Done!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('embed')
      .setDescription('Create an embed message')
      .addStringOption(o => o.setName('title').setDescription('Embed title').setRequired(true))
      .addStringOption(o => o.setName('description').setDescription('Embed description').setRequired(true))
      .addStringOption(o => o.setName('color').setDescription('Hex color e.g. #ff0000')),
    async execute(interaction) {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getString('color') || '#0099ff';
      await interaction.channel.send({ embeds: [new EmbedBuilder().setColor(color).setTitle(title).setDescription(description)] });
      interaction.reply({ content: '✅ Embed sent!', ephemeral: true });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('timestamp')
      .setDescription('Generate a Discord timestamp')
      .addIntegerOption(o => o.setName('year').setDescription('Year').setRequired(true))
      .addIntegerOption(o => o.setName('month').setDescription('Month').setRequired(true))
      .addIntegerOption(o => o.setName('day').setDescription('Day').setRequired(true)),
    async execute(interaction) {
      const year = interaction.options.getInteger('year');
      const month = interaction.options.getInteger('month') - 1;
      const day = interaction.options.getInteger('day');
      const unix = Math.floor(new Date(year, month, day).getTime() / 1000);
      interaction.reply(`⏰ Timestamp: <t:${unix}:F> — \`<t:${unix}:F>\``);
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('calc')
      .setDescription('Calculate a math expression')
      .addStringOption(o => o.setName('expression').setDescription('Math expression e.g. 2+2').setRequired(true)),
    async execute(interaction) {
      try {
        const math = require('mathjs');
        const expr = interaction.options.getString('expression');
        const result = math.evaluate(expr);
        interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🧮 Calculator').setDescription(`**${expr}** = **${result}**`)] });
      } catch {
        interaction.reply({ content: '❌ Invalid expression!', ephemeral: true });
      }
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('remind')
      .setDescription('Set a reminder')
      .addStringOption(o => o.setName('time').setDescription('Time e.g. 10m, 1h').setRequired(true))
      .addStringOption(o => o.setName('reminder').setDescription('What to remind you about').setRequired(true)),
    async execute(interaction) {
      const ms = require('ms');
      const time = interaction.options.getString('time');
      const reminder = interaction.options.getString('reminder');
      const delay = ms(time);
      if (!delay) return interaction.reply({ content: '❌ Invalid time!', ephemeral: true });
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('⏰ Reminder Set!').setDescription(`I'll remind you about **${reminder}** in **${time}**!`)] });
      setTimeout(() => {
        interaction.followUp({ content: `⏰ <@${interaction.user.id}> Reminder: **${reminder}**` });
      }, delay);
    }
  },
];
