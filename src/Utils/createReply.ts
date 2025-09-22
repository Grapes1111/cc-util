import { REST } from "@discordjs/rest";
import { RESTPostAPIInteractionCallbackJSONBody, RESTPostAPIInteractionCallbackFormDataBody, APIInteraction } from "discord-api-types/v10";
import { Context } from "hono";
import { Variables, Env } from "../env";
import { ExecuteReply } from "../Structures/SlashCommand";

export function createReply(
    ctx: Context<{ Bindings: Env; Variables: Variables }>,
    interaction: APIInteraction
): ExecuteReply {
    const rest = ctx.get("rest") as REST;
    return async (
        options: RESTPostAPIInteractionCallbackJSONBody | RESTPostAPIInteractionCallbackFormDataBody
    ) => {
        const endpoint = `/interactions/${interaction.id}/${interaction.token}/callback` as const;
        await rest.post(endpoint, { 
            body: options 
        });
    };
}