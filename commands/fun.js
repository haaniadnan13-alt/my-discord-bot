const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName('meme')
      .setDescription('Get a random meme'),
    async execute(interaction) {
      await interaction.deferReply();
      const res = await fetch('https://meme-api.com/gimme');
      const data = await res.json();
      interaction.editReply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle(data.title).setImage(data.url).setFooter({ text: `👍 ${data.ups} | r/${data.subreddit}` })] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('joke')
      .setDescription('Get a random joke'),
    async execute(interaction) {
      await interaction.deferReply();
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await res.json();
      interaction.editReply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle('😂 Random Joke').setDescription(`**${data.setup}**\n\n${data.punchline}`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('8ball')
      .setDescription('Ask the magic 8ball a question')
      .addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
    async execute(interaction) {
      const responses = ['Yes!', 'No!', 'Maybe...', 'Definitely!', 'Absolutely not!', 'Ask again later', 'Without a doubt!', 'Very doubtful'];
      const answer = responses[Math.floor(Math.random() * responses.length)];
      const question = interaction.options.getString('question');
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Purple').setTitle('🎱 Magic 8Ball').addFields({ name: 'Question', value: question }, { name: 'Answer', value: answer })] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('coinflip')
      .setDescription('Flip a coin'),
    async execute(interaction) {
      const result = Math.random() < 0.5 ? '🪙 Heads!' : '🪙 Tails!';
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle('🪙 Coin Flip').setDescription(result)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('roll')
      .setDescription('Roll a dice')
      .addIntegerOption(o => o.setName('sides').setDescription('Number of sides (default 6)')),
    async execute(interaction) {
      const sides = interaction.options.getInteger('sides') || 6;
      const result = Math.floor(Math.random() * sides) + 1;
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setTitle('🎲 Dice Roll').setDescription(`You rolled a **${result}** on a ${sides}-sided dice!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('gif')
      .setDescription('Get a random GIF')
      .addStringOption(o => o.setName('keyword').setDescription('GIF keyword').setRequired(true)),
    async execute(interaction) {
      await interaction.deferReply();
      const keyword = interaction.options.getString('keyword');
      const res = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${keyword}`);
      const data = await res.json();
      if (!data.data.image_url) return interaction.editReply('❌ No GIF found!');
      interaction.editReply({ embeds: [new EmbedBuilder().setColor('Pink').setTitle(`🎬 ${keyword} GIF`).setImage(data.data.image_url)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('reverse')
      .setDescription('Reverse some text')
      .addStringOption(o => o.setName('text').setDescription('Text to reverse').setRequired(true)),
    async execute(interaction) {
      const text = interaction.options.getString('text');
      const reversed = text.split('').reverse().join('');
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🔄 Reversed Text').addFields({ name: 'Original', value: text }, { name: 'Reversed', value: reversed })] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('choose')
      .setDescription('Choose between options')
      .addStringOption(o => o.setName('options').setDescription('Options separated by commas e.g. pizza,burger,sushi').setRequired(true)),
    async execute(interaction) {
      const options = interaction.options.getString('options').split(',').map(o => o.trim());
      const choice = options[Math.floor(Math.random() * options.length)];
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Green').setTitle('🤔 I Choose...').setDescription(`**${choice}**`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('rate')
      .setDescription('Rate something')
      .addStringOption(o => o.setName('thing').setDescription('What to rate').setRequired(true)),
    async execute(interaction) {
      const thing = interaction.options.getString('thing');
      const rating = Math.floor(Math.random() * 11);
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Yellow').setTitle('⭐ Rating').setDescription(`I rate **${thing}** a **${rating}/10**!`)] });
    }
  },
  {
    data: new SlashCommandBuilder()
      .setName('ascii')
      .setDescription('Convert text to ASCII art')
      .addStringOption(o => o.setName('text').setDescription('Text to convert').setRequired(true)),
    async execute(interaction) {
      const text = interaction.options.getString('text');
      interaction.reply({ embeds: [new EmbedBuilder().setColor('Blue').setTitle('🎨 ASCII Art').setDescription(`\`\`\`${text.toUpperCase().split('').join('  ')}\`\`\``)] });
    }
  },
];
