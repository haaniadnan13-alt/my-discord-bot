const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meganuke')
        .setDescription('☢️ DESTROY EVERYTHING: Deletes all channels and roles in other words gets slimed by caseho')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const guild = interaction.guild;

        // Open to any Admin
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ You do not have the clearance for a MEGA NUKE.', ephemeral: true });
        }

        await interaction.reply({ content: '⚠️ **MEGA NUKE INBOUND.** Total server wipe in 5 seconds... There is no turning back.' });

        setTimeout(async () => {
            try {
                // 1. Wipe all Channels
                const channels = await guild.channels.fetch();
                for (const channel of channels.values()) {
                    if (channel) await channel.delete().catch(() => {});
                }

                // 2. Wipe all Roles (except @everyone and bot-managed roles)
                const roles = await guild.roles.fetch();
                for (const role of roles.values()) {
                    if (role.name !== '@everyone' && role.editable && !role.managed) {
                        await role.delete().catch(() => {});
                    }
                }

                // 3. Post-Blast Landing Zone
                const wasteland = await guild.channels.create({
                    name: '☢┃wasteland',
                    type: ChannelType.GuildText
                });

                await wasteland.send('# ☢️ SERVER FORGE: MEGA NUKE COMPLETE\n**All systems purged.** The server has been reset to absolute zero.');

            } catch (err) {
                console.error("Mega Nuke failed:", err);
            }
        }, 5000);
    }
};
