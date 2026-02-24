import { SelectMenu } from "../Structures/SelectMenu";
import {
    InteractionResponseType,
    MessageFlags,
    Routes,
} from "discord-api-types/v10";

const pogRoles = [
    "1385764630101754048", // Single Print
    "1385764540050051202", // Mid Print
    "1385764529618555015", // Low Print
    "1384281801148600590", // High Wl
    "1385764456792985612", // Mid Wl
    "1384281826561888288", // Low Wl
];

export default new SelectMenu({
    customId: "rr_pog",
    async execute(ctx, interaction, reply) {
        const rest = ctx.get("rest");
        const guildId = interaction.guild_id;

        if (!guildId) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Unable to resolve the guild id for this guild",
                    flags: MessageFlags.Ephemeral,
                },
            });
        }

        const member = interaction.member;

        if (!member) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Unable to resolve member object",
                    flags: MessageFlags.Ephemeral,
                },
            });
        }

        const userId = member.user.id;
        const selectedRoles = interaction.data.values;

        const otherRoles = member.roles.filter((r) => !pogRoles.includes(r));
        const finalRoles = [...otherRoles, ...selectedRoles];

        await rest.patch(Routes.guildMember(guildId, userId), {
            body: { roles: finalRoles },
        });

        await reply({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `✅ Updated your Pog roles to: ${selectedRoles
                    .map((id) => `<@&${id}>`)
                    .join(", ")}`,
                flags: MessageFlags.Ephemeral,
            },
        });
    },
});