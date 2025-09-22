import {
    APIApplicationCommandInteraction,
    RESTPostAPIInteractionCallbackJSONBody,
    RESTPostAPIInteractionCallbackFormDataBody,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    APIChatInputApplicationCommandInteraction,
} from "discord-api-types/v10";
import { Context } from "hono";
import { Env, Variables } from "../env";

export type ExecuteReply = (options: RESTPostAPIInteractionCallbackJSONBody | RESTPostAPIInteractionCallbackFormDataBody) => Promise<any>;

export type Execute = (
    ctx: Context<{ Bindings: Env; Variables: Variables }>,
    interaction: APIChatInputApplicationCommandInteraction,
    reply: ExecuteReply
) => Promise<any>;

export class SlashCommand {
    public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    public readonly execute: Execute;
    constructor(data: Omit<SlashCommand, "data" | "execute"> & { data: SlashCommand["data"], execute: Execute }) {
        this.data = data.data;
        this.execute = data.execute;
    }
}