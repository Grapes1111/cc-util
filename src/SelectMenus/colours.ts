import { SelectMenu } from "../Structures/SelectMenu";
import { InteractionResponseType, MessageFlags, Routes } from "discord-api-types/v10";

const colourRoles = [
    "1419739699567657040", // Red
    "1419739700234682520", // Green
    "1419739701845295256", // Blue
    "1419739702449406043", // Yellow
    "1419739703006990437", // Purple
    "1419739703753838702"  // Orange
];

export default new SelectMenu({
    customId: "rr_colour",
    async execute(ctx, interaction, reply) {
        const rest = ctx.get("rest");
        const guildId = interaction.guild_id;

        if(!guildId) return await reply({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "Unable to resolve the guild id for this guild",
                flags: MessageFlags.Ephemeral
            }
        })
        const member = interaction.member;

        if (!member) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Unable to resolve member object",
                    flags: MessageFlags.Ephemeral
                }
            })
        }
        const userId = member.user.id

        const selectedRole = interaction.data.values[0];

        const roles = member.roles.filter(
            (r) => !colourRoles.includes(r)
        );
        roles.push(selectedRole);

        // update roles
        await rest.patch(Routes.guildMember(guildId, userId), {
            body: { roles }
        });

        await reply({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `✅ Updated your colour role to <@&${selectedRole}>`,
                flags: 64
            }
        });
    },
});
