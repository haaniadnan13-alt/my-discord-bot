const { SlashCommandBuilder } = require('discord.js');

module.exports = [
    {
        data: new SlashCommandBuilder()
            .setName('8ball')
            .setDescription('🔮 Ask the magic 8-ball a question')
            .addStringOption(option => option.setName('question').setDescription('Your question').setRequired(true)),
        async execute(interaction) {
            const responses = ["Yes.", "No.", "Ask again later.", "Definitely.", "Very doubtful.", "Most likely."];
            const choice = responses[Math.floor(Math.random() * responses.length)];
            await interaction.reply(`🔮 **Question:** ${interaction.options.getString('question')}\n✨ **Answer:** ${choice}`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('coinflip')
            .setDescription('🪙 Flip a coin'),
        async execute(interaction) {
            const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
            await interaction.reply(`🪙 The coin landed on: **${result}**!`);
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('joke')
            .setDescription('🤣 Get a random joke'),
        async execute(interaction) {
            const jokes = [
                "Why did the scarecrow win an award? Because he was outstanding in his field!",
                "What do you call a fake noodle? An impasta!",
                "Why don't scientists trust atoms? Because they make up everything!"
            ];
            await interaction.reply(`🤣 ${jokes[Math.floor(Math.random() * jokes.length)]}`);
        }
    }
];
