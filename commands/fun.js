const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder().setName('meme').setDescription('😂 Get a random meme'),
        async execute(interaction) {
            const res = await fetch('https://meme-api.com/gimme');
            const data = await res.json();
            const embed = new EmbedBuilder().setColor('#00FFCC').setTitle(data.title).setImage(data.url).setFooter({ text: `r/${data.subreddit} | 🟢 ScriptVault` });
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('joke').setDescription('🤣 Get a random joke'),
        async execute(interaction) {
            const jokes = ["Why don't scientists trust atoms? Because they make up everything!", "What do you call a fake noodle? An impasta!", "Why did the computer show up late? It had a hard drive!", "I told my wife she was drawing her eyebrows too high. She looked surprised."];
            await interaction.reply(jokes[Math.floor(Math.random() * jokes.length)]);
        }
    },
    {
        data: new SlashCommandBuilder().setName('8ball').setDescription('🎱 Ask the magic 8ball').addStringOption(o => o.setName('question').setDescription('Your question').setRequired(true)),
        async execute(interaction) {
            const replies = ["Yes.", "No.", "Maybe.", "Ask again later.", "Definitely.", "Very doubtful.", "Most likely."];
            const embed = new EmbedBuilder().setColor('#BF00FF').setTitle('🎱 Magic 8-Ball').addFields({ name: 'Question', value: interaction.options.getString('question') }, { name: 'Answer', value: replies[Math.floor(Math.random() * replies.length)] });
            await interaction.reply({ embeds: [embed] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('coinflip').setDescription('🪙 Flip a coin'),
        async execute(interaction) {
            await interaction.reply(`🪙 The coin landed on: **${Math.random() > 0.5 ? 'Heads' : 'Tails'}**!`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('roll').setDescription('🎲 Roll a die').addIntegerOption(o => o.setName('sides').setDescription('Number of sides (Default 6)')),
        async execute(interaction) {
            const sides = interaction.options.getInteger('sides') || 6;
            await interaction.reply(`🎲 You rolled a **${Math.floor(Math.random() * sides) + 1}** (1-${sides})!`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('mock').setDescription('🤡 mOcK tExT').addStringOption(o => o.setName('text').setDescription('Text to mock').setRequired(true)),
        async execute(interaction) {
            const text = interaction.options.getString('text');
            await interaction.reply(text.split('').map((char, i) => i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()).join(''));
        }
    },
    {
        data: new SlashCommandBuilder().setName('rate').setDescription('📊 Rate a user').addUserOption(o => o.setName('target').setDescription('Who to rate').setRequired(true)),
        async execute(interaction) {
            const user = interaction.options.getUser('target');
            await interaction.reply(`📊 I rate **${user.username}** a **${Math.floor(Math.random() * 101)}/100**!`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('compliment').setDescription('💖 Get a compliment').addUserOption(o => o.setName('target').setDescription('Who to compliment')),
        async execute(interaction) {
            const user = interaction.options.getUser('target') || interaction.user;
            const comps = ["You're awesome!", "Your positivity is contagious.", "You make the server better!", "Great job today!"];
            await interaction.reply(`${user}, ${comps[Math.floor(Math.random() * comps.length)]}`);
        }
    },
    {
        data: new SlashCommandBuilder().setName('fact').setDescription('🧠 Random facts'),
        async execute(interaction) {
            const facts = ["Honey never spoils.", "A day on Venus is longer than a year.", "Bananas are berries, strawberries aren't.", "Octopuses have three hearts."];
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#0077FF').setTitle('🧠 Fact').setDescription(facts[Math.floor(Math.random() * facts.length)])] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('cat').setDescription('🐱 Random cat picture'),
        async execute(interaction) {
            const res = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await res.json();
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#BF00FF').setTitle('🐱 Meow!').setImage(data[0].url)] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('dog').setDescription('🐶 Random dog picture'),
        async execute(interaction) {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await res.json();
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#0077FF').setTitle('🐶 Woof!').setImage(data.message)] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('space').setDescription('🚀 Space facts'),
        async execute(interaction) {
            const spaceFacts = ["The footprints on the Moon will last for 100 million years.", "One million Earths could fit inside the Sun.", "There is a planet made of diamonds."];
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setTitle('🚀 Space Fact').setDescription(spaceFacts[Math.floor(Math.random() * spaceFacts.length)])] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('motive').setDescription('💪 Motivational quotes'),
        async execute(interaction) {
            const quotes = ["Don't stop when you're tired. Stop when you're done.", "Believe you can and you're halfway there.", "Your only limit is your mind."];
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#BF00FF').setTitle('💪 Motivation').setDescription(quotes[Math.floor(Math.random() * quotes.length)])] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('history').setDescription('📜 History facts'),
        async execute(interaction) {
            const history = ["The Great Wall of China is over 13,000 miles long.", "Ancient Egyptians used moldy bread to help heal wounds.", "The shortest war in history lasted 38 minutes."];
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#0077FF').setTitle('📜 History').setDescription(history[Math.floor(Math.random() * history.length)])] });
        }
    },
    {
        data: new SlashCommandBuilder().setName('science').setDescription('🧪 Science facts'),
        async execute(interaction) {
            const science = ["Water can boil and freeze at the same time.", "The human stomach can dissolve razor blades.", "Light travels from the Sun to Earth in 8 minutes."];
            await interaction.reply({ embeds: [new EmbedBuilder().setColor('#00FFCC').setTitle('🧪 Science').setDescription(science[Math.floor(Math.random() * science.length)])] });
        }
    }
];
