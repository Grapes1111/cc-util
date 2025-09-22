import { InteractionResponseType, MessageFlags, Routes } from "discord-api-types/v10";
import { ButtonCommand } from "../Structures/Buttons";
import { ccGuildId } from "../constants";

export default new ButtonCommand({
    customId: "rr_bot",
    async execute(ctx, interaction, reply) {
        const customId = interaction.data.custom_id;

        const [, roleId] = customId.split("-");

        if (!roleId) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Role id not found in customId",
                    flags: MessageFlags.Ephemeral
                }
            });
        }

        const member = interaction.member;

        if (!member) {
            return await reply({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Unable to resolve member object",
                    flags: MessageFlags.Ephemeral
                }
            });
        }

        const rest = ctx.get("rest");

        let action: "added" | "removed";
        if (member.roles.includes(roleId)) {
            await rest.delete(Routes.guildMemberRole(ccGuildId, member.user.id, roleId));
            action = "removed";
        } else {
            await rest.put(Routes.guildMemberRole(ccGuildId, member.user.id, roleId));
            action = "added";
        }

        await reply({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Successfully ${action} <@&${roleId}> ${action === "added" ? "to" : "from"} you`,
                flags: MessageFlags.Ephemeral
            }
        });
    }
});