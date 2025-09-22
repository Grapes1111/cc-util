import {
    APIMessageComponentInteraction,
    RESTPostAPIInteractionCallbackJSONBody,
    RESTPostAPIInteractionCallbackFormDataBody,
} from "discord-api-types/v10";
import { Context } from "hono";
import { Env, Variables } from "../env";

export type ButtonExecuteReply = (options: RESTPostAPIInteractionCallbackJSONBody | RESTPostAPIInteractionCallbackFormDataBody) => Promise<any>;

export type ButtonExecute = (
    ctx: Context<{ Bindings: Env; Variables: Variables }>,
    interaction: APIMessageComponentInteraction,
    reply: ButtonExecuteReply
) => Promise<any>;

export class ButtonCommand {
    public readonly customId: string;
    public readonly execute: ButtonExecute;
    constructor(data: Omit<ButtonCommand, "customId" | "execute"> & { customId: string; execute: ButtonExecute }) {
        this.customId = data.customId;
        this.execute = data.execute;
    }
}