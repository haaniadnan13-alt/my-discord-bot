const { SlashCommandBuilder } = require('discord.js');

// Data definitions
const roles = [/* roles data */];
const ranks = [/* ranks data */];
const categories = [/* categories data */];
const channels = [/* channels data */];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yourCommandName')
        .setDescription('Description of your command'),
    async execute(interaction) {
        // Your command execution logic goes here.
        await interaction.reply('Your response here!');
    },
    roles,
    ranks,
    categories,
    channels
};