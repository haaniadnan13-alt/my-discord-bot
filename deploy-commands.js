const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('ban').setDescription('Ban a user').addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true)),
  new SlashCommandBuilder().setName('clear').setDescription('Clear messages').addIntegerOption(o => o.setName('amount').setDescription('Amount to clear').setRequired(true)),
  new SlashCommandBuilder().setName('poll').setDescription('Create a poll').addStringOption(o => o.setName('question').setDescription('Poll question').setRequired(true)),
  new SlashCommandBuilder().setName('ping').setDescription('Check bot speed'),
  new SlashCommandBuilder().setName('help').setDescription('Show all commands'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  console.log('Registering slash commands...');
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  console.log('✅ Slash commands registered!');
})();
