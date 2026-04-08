const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('☢️ Total server reset: Deletes all channels and roles (use at your own risk lol)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const guild = interaction.guild;

        // Standard Admin check (anyone with the Admin permission can use this)
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ You need Administrator permissions to use this.', ephemeral: true });
        }

        await interaction.reply({ content: '⚠️ **Nuke initiated by Admin.** Self-destructing in 5 seconds...' });

        setTimeout(async () => {
            try {
                // Delete Channels
                const channels = await guild.channels.fetch();
                for (const channel of channels.values()) {
                    if (channel) await channel.delete().catch(() => {});
                }

                // Delete Roles (Bot must be top of the list)
                const roles = await guild.roles.fetch();
                for (const role of roles.values()) {
                    if (role.name !== '@everyone' && role.editable && !role.managed) {
                        await role.delete().catch(() => {});
                    }
                }

                // Final message
                const finalChannel = await guild.channels.create({
                    name: '☢┃nuked',
                    type: ChannelType.GuildText
                });

                await finalChannel.send('**SYSTEMS PURGED.** \nThe server has been reset by an Administrator.');

            } catch (err) {
                console.error(err);
            }
        }, 5000);
    }
};
